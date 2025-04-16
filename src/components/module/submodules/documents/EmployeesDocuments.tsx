
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Plus, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useDocumentsData, HrDocument } from '@/hooks/useDocumentsData';
import { DocumentsList } from '@/components/module/documents/components/DocumentsList';
import { SearchResults } from '@/components/module/documents/components/SearchResults';
import { DocumentsEmptyState } from '@/components/module/documents/components/DocumentsEmptyState';
import { DocumentsLoading } from '@/components/module/documents/components/DocumentsLoading';
import { addEmployeeDocument } from '../employees/services/documentService';
import NewDocumentDialog from './components/NewDocumentDialog';
import { Document } from '@/types/employee';

const EmployeesDocuments: React.FC = () => {
  const { documents, isLoading, error } = useDocumentsData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState<HrDocument[]>([]);
  const [isNewDocumentDialogOpen, setIsNewDocumentDialogOpen] = useState(false);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredDocuments([]);
      return;
    }
    
    const filtered = documents.filter(doc => 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.employeeName && doc.employeeName.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    setFilteredDocuments(filtered);
  }, [searchQuery, documents]);
  
  const handleCreateDocument = async (document: Document, employeeId: string) => {
    try {
      await addEmployeeDocument(employeeId, document);
      toast.success('Document ajouté avec succès');
      return Promise.resolve();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document:', error);
      toast.error('Erreur lors de l\'ajout du document');
      return Promise.reject(error);
    }
  };
  
  if (error) {
    return <div className="p-4">Erreur lors du chargement des documents: {error.message}</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Documents RH</h2>
        <Button onClick={() => setIsNewDocumentDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau document
        </Button>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recherche de documents</CardTitle>
          <CardDescription>
            Recherchez des documents par titre, type ou employé
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      
      {searchQuery.trim() !== '' ? (
        <SearchResults results={filteredDocuments} searchQuery={searchQuery} />
      ) : (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">Tous les documents</TabsTrigger>
            <TabsTrigger value="contracts">Contrats</TabsTrigger>
            <TabsTrigger value="payslips">Fiches de paie</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {isLoading ? (
              <DocumentsLoading />
            ) : documents.length === 0 ? (
              <DocumentsEmptyState />
            ) : (
              <DocumentsList documents={documents} />
            )}
          </TabsContent>
          
          <TabsContent value="contracts">
            {isLoading ? (
              <DocumentsLoading />
            ) : (
              <DocumentsList 
                documents={documents.filter(doc => 
                  doc.type.toLowerCase().includes('contrat')
                )} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="payslips">
            {isLoading ? (
              <DocumentsLoading />
            ) : (
              <DocumentsList 
                documents={documents.filter(doc => 
                  doc.type.toLowerCase().includes('paie') || 
                  doc.type.toLowerCase().includes('salaire')
                )} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="certifications">
            {isLoading ? (
              <DocumentsLoading />
            ) : (
              <DocumentsList 
                documents={documents.filter(doc => 
                  doc.type.toLowerCase().includes('certification') || 
                  doc.type.toLowerCase().includes('diplôme') ||
                  doc.type.toLowerCase().includes('attestation')
                )} 
              />
            )}
          </TabsContent>
        </Tabs>
      )}
      
      <NewDocumentDialog 
        isOpen={isNewDocumentDialogOpen}
        onOpenChange={setIsNewDocumentDialogOpen}
        onDocumentCreated={handleCreateDocument}
      />
    </div>
  );
};

export default EmployeesDocuments;
