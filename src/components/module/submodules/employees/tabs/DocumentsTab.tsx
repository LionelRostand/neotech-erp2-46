
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Employee, Document } from '@/types/employee';
import { MoreHorizontal, FileText, Trash2, Eye, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { removeEmployeeDocument } from '../services/documentService';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import UploadDocumentDialog from '../../documents/components/UploadDocumentDialog';
import { viewDocument, hexToDataUrl, getDocumentDataSource, downloadFile } from '@/utils/documentUtils';

interface DocumentsTabProps {
  employee: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Pour forcer le rafraîchissement

  const handleDeleteDocument = async (document: Document) => {
    if (!document.id || !employee.id) return;
    
    try {
      await removeEmployeeDocument(employee.id, document.id);
      toast.success(`Document "${document.name}" supprimé avec succès`);
      // Force refresh
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      toast.error("Erreur lors de la suppression du document");
    }
  };

  const handleViewDocument = (document: Document) => {
    const { data, format } = getDocumentDataSource(document);
    if (!data) {
      toast.error("Aucune donnée disponible pour ce document");
      return;
    }
    
    // Ouvrir le document dans une nouvelle fenêtre
    viewDocument(data, document.name, document.fileType || 'application/octet-stream', format);
  };

  const handleDownloadDocument = (document: Document) => {
    const { data, format } = getDocumentDataSource(document);
    if (!data) {
      toast.error("Aucune donnée disponible pour ce document");
      return;
    }
    
    // Télécharger le document
    const extension = document.fileType?.split('/')[1] || 'bin';
    const filename = `${document.name}.${extension}`;
    
    downloadFile(data, filename);
    toast.success(`Téléchargement de "${filename}" démarré`);
  };

  const handleDocumentAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Formatter la date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      return dateString;
    }
  };

  // Formatage de la taille du fichier
  const formatFileSize = (size?: number) => {
    if (!size) return 'N/A';
    if (size < 1024) return `${size} o`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
    return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
  };

  return (
    <div className="space-y-4" key={refreshKey}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Documents</h2>
        <Button onClick={() => setIsUploadOpen(true)}>
          Ajouter un document
        </Button>
      </div>
      
      {employee.documents && employee.documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {employee.documents.map((document: Document) => (
            <Card key={document.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50 py-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{document.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(document.date)} - {formatFileSize(document.fileSize)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDocument(document)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Visualiser
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleDeleteDocument(document)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="py-3">
                <div className="flex items-center mb-3">
                  <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                  <span className="text-sm">Type: <strong>{document.type}</strong></span>
                </div>
                <Separator className="mb-3" />
                <div className="flex flex-wrap gap-2">
                  {document.documentId && (
                    <Badge variant="outline" className="text-xs">
                      ID: {document.documentId}
                    </Badge>
                  )}
                  {document.storageFormat && (
                    <Badge variant="secondary" className="text-xs">
                      Format: {document.storageFormat}
                    </Badge>
                  )}
                  {document.storedInHrDocuments && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                      Stocké dans hr_documents
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-center text-muted-foreground">
              Aucun document n'a été ajouté pour cet employé.
            </p>
            <Button 
              onClick={() => setIsUploadOpen(true)} 
              variant="outline" 
              className="mt-4"
            >
              Ajouter un document
            </Button>
          </CardContent>
        </Card>
      )}
      
      <UploadDocumentDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        employee={employee}
        onDocumentAdded={handleDocumentAdded}
      />
    </div>
  );
};

export default DocumentsTab;
