
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee, Document } from '@/types/employee';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatters';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUser, FileText, Files } from 'lucide-react';

interface DocumentsTabProps {
  employee: Employee;
  onEmployeeUpdated?: (updatedEmployee: Employee) => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ 
  employee,
  onEmployeeUpdated
}) => {
  const [documents, setDocuments] = useState<Document[]>(employee.documents || []);

  const handleViewDocument = (document: Document) => {
    // Check if there's a viewable URL
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    } else if (document.fileData) {
      // Create a data URL for embedded data
      const dataUrl = `data:${document.fileType};base64,${document.fileData}`;
      
      // Open in a new tab
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`
          <html>
            <head>
              <title>${document.name}</title>
            </head>
            <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
              ${document.fileType.startsWith('image/') 
                ? `<img src="${dataUrl}" alt="${document.name}" style="max-width:90%;max-height:90vh;" />`
                : `<iframe src="${dataUrl}" width="100%" height="100%" style="position:absolute;border:none;"></iframe>`
              }
            </body>
          </html>
        `);
      } else {
        toast.error("Impossible d'ouvrir le document, le blocage des popups est peut-être activé");
      }
    } else {
      toast.error("Ce document ne contient pas de données visibles");
    }
  };

  const handleDeleteDocument = (index: number) => {
    toast.error("Fonctionnalité non disponible dans cette démonstration");
  };

  // Filter documents by type
  const cvDocuments = documents.filter(doc => 
    doc.type?.toLowerCase() === 'cv' || 
    doc.name?.toLowerCase().includes('cv')
  );
  
  const contractDocuments = documents.filter(doc => 
    doc.type?.toLowerCase() === 'contrat' || 
    doc.name?.toLowerCase().includes('contrat')
  );

  // Component to render document table
  const DocumentsTable = ({ docs }: { docs: Document[] }) => (
    docs.length > 0 ? (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.map((doc, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{doc.name}</TableCell>
              <TableCell>{doc.type}</TableCell>
              <TableCell>{formatDate(new Date(doc.date))}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleViewDocument(doc)}>
                    Voir
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteDocument(index)}>
                    Supprimer
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    ) : (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucun document dans cette catégorie</p>
      </div>
    )
  );

  // Empty state component
  const EmptyState = () => (
    <div className="text-center py-8 text-muted-foreground">
      <p>Aucun document associé à cet employé</p>
      <p className="text-sm mt-2">Cliquez sur "Ajouter un document" pour en importer un nouveau</p>
    </div>
  );

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Documents</h3>
          <Button variant="outline" size="sm">
            Ajouter un document
          </Button>
        </div>
        
        {documents.length > 0 ? (
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">
                <Files className="h-4 w-4 mr-2" />
                Tous
              </TabsTrigger>
              <TabsTrigger value="cv">
                <FileUser className="h-4 w-4 mr-2" />
                CV
              </TabsTrigger>
              <TabsTrigger value="contrats">
                <FileText className="h-4 w-4 mr-2" />
                Contrats
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <DocumentsTable docs={documents} />
            </TabsContent>
            
            <TabsContent value="cv">
              <DocumentsTable docs={cvDocuments} />
            </TabsContent>
            
            <TabsContent value="contrats">
              <DocumentsTable docs={contractDocuments} />
            </TabsContent>
          </Tabs>
        ) : (
          <EmptyState />
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsTab;
