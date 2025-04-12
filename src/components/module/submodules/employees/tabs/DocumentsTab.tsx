
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Employee, Document } from '@/types/employee';
import { FileText, Plus, Trash2, Download, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { getEmployeeDocuments, removeEmployeeDocument } from '../services/documentService';
import UploadDocumentDialog from '../../documents/components/UploadDocumentDialog';

interface DocumentsTabProps {
  employee: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDocumentOpen, setIsAddDocumentOpen] = useState(false);
  
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const docs = await getEmployeeDocuments(employee.id);
      setDocuments(docs);
    } catch (error) {
      console.error('Erreur lors de la récupération des documents:', error);
      toast.error('Erreur lors de la récupération des documents');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDocuments();
  }, [employee.id]);
  
  const handleViewDocument = (document: Document) => {
    // Priorité: 1. données binaires base64, 2. URL du fichier
    if (document.fileData) {
      // Si nous avons des données base64, ouvrir dans un nouvel onglet
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`
          <html>
            <head>
              <title>${document.name || 'Document'}</title>
            </head>
            <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #f0f0f0;">
              <img src="${document.fileData}" style="max-width: 100%; max-height: 90vh; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />
            </body>
          </html>
        `);
        newTab.document.close();
      } else {
        toast.error("Le navigateur a bloqué l'ouverture d'un nouvel onglet");
      }
    } else if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    } else {
      toast.error("Aucun fichier disponible pour ce document");
    }
  };
  
  const handleDownloadDocument = (document: Document) => {
    if (document.fileData) {
      // Créer un lien de téléchargement à partir des données base64
      const link = document.createElement('a');
      link.href = document.fileData;
      link.download = document.name || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (document.fileUrl) {
      const link = document.createElement('a');
      link.href = document.fileUrl;
      link.download = document.name || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error("Aucun fichier disponible pour ce document");
    }
  };
  
  const handleDeleteDocument = async (documentId?: string) => {
    if (!documentId) return;
    
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      try {
        await removeEmployeeDocument(employee.id, documentId);
        setDocuments(documents.filter(doc => doc.id !== documentId));
        toast.success("Document supprimé avec succès");
      } catch (error) {
        console.error('Erreur lors de la suppression du document:', error);
        toast.error("Erreur lors de la suppression du document");
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documents de l'employé</CardTitle>
          <Button onClick={() => setIsAddDocumentOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un document
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-6">
              <FileText className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-muted-foreground">Aucun document disponible</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => setIsAddDocumentOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter votre premier document
              </Button>
            </div>
          ) : (
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
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium">{document.name}</TableCell>
                    <TableCell>{document.type}</TableCell>
                    <TableCell>
                      {document.date ? new Date(document.date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDocument(document)}
                        title="Visualiser"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDownloadDocument(document)}
                        title="Télécharger"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteDocument(document.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <UploadDocumentDialog
        open={isAddDocumentOpen}
        onOpenChange={setIsAddDocumentOpen}
        employee={employee}
        onDocumentAdded={fetchDocuments}
      />
    </div>
  );
};

export default DocumentsTab;
