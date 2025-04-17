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
import { Plus, Search, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useDocumentsData, HrDocument } from '@/hooks/useDocumentsData';
import { DocumentsList } from '@/components/module/documents/components/DocumentsList';
import { SearchResults } from '@/components/module/documents/components/SearchResults';
import { DocumentsEmptyState } from '@/components/module/documents/components/DocumentsEmptyState';
import { DocumentsLoading } from '@/components/module/documents/components/DocumentsLoading';
import { addEmployeeDocument } from '../employees/services/documentService';
import NewDocumentDialog from './components/NewDocumentDialog';
import { Document } from '@/types/employee';
import { DocumentFile } from '../../documents/types/document-types';
import { isValid } from 'date-fns';

// Adapter function to convert HrDocument to DocumentFile with better date handling
const adaptHrDocumentToDocumentFile = (doc: HrDocument): DocumentFile => {
  // Parse the date safely
  const getValidDate = (dateStr?: string): Date => {
    if (!dateStr) return new Date(); // Fallback to current date if no date provided
    
    try {
      const date = new Date(dateStr);
      // Check if date is valid, if not return current date
      return isValid(date) ? date : new Date();
    } catch (error) {
      console.error('Error parsing date:', error, dateStr);
      return new Date(); // Fallback to current date if parsing fails
    }
  };
  
  // Find the first valid date among the options
  const getFirstValidDate = (...dateCandidates: (string | undefined)[]): Date => {
    for (const dateStr of dateCandidates) {
      if (dateStr) {
        const date = getValidDate(dateStr);
        if (isValid(date)) {
          return date;
        }
      }
    }
    return new Date(); // Fallback to current date if no valid dates
  };
  
  // Try to get a valid date for creation date
  const createdDate = getFirstValidDate(
    doc.uploadDate, 
    doc.createdAt, 
    doc.date
  );
  
  return {
    id: doc.id,
    name: doc.title,
    type: doc.type,
    size: typeof doc.fileSize === 'string' ? parseInt(doc.fileSize) || 0 : doc.fileSize || 0,
    format: doc.fileType || 'unknown',
    path: doc.url || '',
    createdAt: createdDate,
    updatedAt: createdDate, // Use same date for updated if not available
    createdBy: doc.employeeName || 'Unknown',
    isEncrypted: false,
    status: 'active',
    versions: [],
    permissions: [],
    tags: [doc.type],
    description: doc.description || '',
    department: doc.department || '',
    category: doc.type
  };
};

const EmployeesDocuments: React.FC = () => {
  const { documents, isLoading, error } = useDocumentsData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDocuments, setFilteredDocuments] = useState<HrDocument[]>([]);
  const [isNewDocumentDialogOpen, setIsNewDocumentDialogOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  
  // Convert HrDocuments to DocumentFiles with safe date handling
  const adaptedDocuments = documents.map(adaptHrDocumentToDocumentFile);
  const adaptedFilteredDocuments = filteredDocuments.map(adaptHrDocumentToDocumentFile);
  
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
  
  const getDocumentIcon = (doc: DocumentFile) => {
    return <FileText className="h-5 w-5 text-blue-500" />;
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
        <SearchResults 
          results={adaptedFilteredDocuments} 
          isLoading={isLoading}
          onSelect={setSelectedDocument}
          selectedDocument={selectedDocument}
          getDocumentIcon={getDocumentIcon}
          searchQuery={searchQuery}
        />
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
              <DocumentsLoading view={view} />
            ) : adaptedDocuments.length === 0 ? (
              <DocumentsEmptyState />
            ) : (
              <DocumentsList 
                documents={adaptedDocuments} 
                view={view} 
                onSelect={setSelectedDocument}
                selected={selectedDocument?.id}
              />
            )}
          </TabsContent>
          
          <TabsContent value="contracts">
            {isLoading ? (
              <DocumentsLoading view={view} />
            ) : (
              <DocumentsList 
                documents={adaptedDocuments.filter(doc => 
                  doc.type.toLowerCase().includes('contrat')
                )}
                view={view}
                onSelect={setSelectedDocument}
                selected={selectedDocument?.id}
              />
            )}
          </TabsContent>
          
          <TabsContent value="payslips">
            {isLoading ? (
              <DocumentsLoading view={view} />
            ) : (
              <DocumentsList 
                documents={adaptedDocuments.filter(doc => 
                  doc.type.toLowerCase().includes('paie') || 
                  doc.type.toLowerCase().includes('salaire')
                )}
                view={view}
                onSelect={setSelectedDocument}
                selected={selectedDocument?.id}
              />
            )}
          </TabsContent>
          
          <TabsContent value="certifications">
            {isLoading ? (
              <DocumentsLoading view={view} />
            ) : (
              <DocumentsList 
                documents={adaptedDocuments.filter(doc => 
                  doc.type.toLowerCase().includes('certification') || 
                  doc.type.toLowerCase().includes('diplôme') ||
                  doc.type.toLowerCase().includes('attestation')
                )}
                view={view}
                onSelect={setSelectedDocument}
                selected={selectedDocument?.id}
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
