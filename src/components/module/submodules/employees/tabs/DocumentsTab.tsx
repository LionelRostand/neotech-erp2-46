import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Employee, Document } from '@/types/employee';
import { Plus, FileText, Trash2, Download, File } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getEmployeeDocuments, 
  removeEmployeeDocument 
} from '../services/documentService';
import UploadDocumentDialog from '../../documents/components/UploadDocumentDialog';
import { formatDate } from '@/lib/formatters';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface DocumentsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ 
  employee, 
  isEditing = false,
  onFinishEditing 
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  
  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        if (employee.id) {
          if (employee.documents && Array.isArray(employee.documents) && employee.documents.length > 0) {
            setDocuments(employee.documents as Document[]);
          } else {
            const fetchedDocs = await getEmployeeDocuments(employee.id);
            setDocuments(fetchedDocs);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des documents:", error);
        toast.error("Erreur lors du chargement des documents");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDocuments();
  }, [employee]);
  
  const handleDocumentAdded = (newDocument: Document) => {
    setDocuments(prev => [...prev, newDocument]);
  };
  
  const handleDeleteDocument = async () => {
    if (!documentToDelete || !employee.id) return;
    
    try {
      await removeEmployeeDocument(employee.id, documentToDelete.id!);
      
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete.id));
      
      toast.success("Document supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      toast.error("Erreur lors de la suppression du document");
    } finally {
      setDocumentToDelete(null);
    }
  };
  
  const getDocumentIcon = (document: Document) => {
    const fileType = document.fileType?.toLowerCase() || '';
    
    if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('png') || fileType.includes('jpeg')) {
      return <File className="h-6 w-6" />;
    } else if (fileType.includes('pdf')) {
      return <FileText className="h-6 w-6" />;
    } else {
      return <FileText className="h-6 w-6" />;
    }
  };
  
  const formatFileSize = (size?: number): string => {
    if (!size) return '';
    
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  const formatDocumentDate = (dateString?: string): string => {
    return formatDate(dateString, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documents</CardTitle>
          {isEditing && (
            <Button 
              size="sm" 
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un document
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">Chargement des documents...</p>
            </div>
          ) : documents.length > 0 ? (
            <div className="grid gap-4">
              {documents.map((document) => (
                <div key={document.id} className="flex items-start p-3 border rounded-md hover:bg-muted/30 transition-colors">
                  <div className="rounded-md bg-blue-100 p-2 text-blue-700 mr-3">
                    {getDocumentIcon(document)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{document.name}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      <span>{document.type || 'Document'}</span>
                      {document.fileSize && (
                        <span> • {formatFileSize(document.fileSize)}</span>
                      )}
                      <span> • {formatDocumentDate(document.date)}</span>
                    </div>
                  </div>
                  {isEditing && (
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost"
                        size="icon"
                        onClick={() => setDocumentToDelete(document)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Aucun document disponible</p>
              {isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un document
                </Button>
              )}
            </div>
          )}
        </CardContent>
        
        {isEditing && documents.length > 0 && (
          <CardFooter className="border-t px-6 py-4 bg-muted/20">
            <div className="ml-auto">
              <Button 
                variant="outline" 
                onClick={onFinishEditing}
              >
                Terminer
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
      
      <UploadDocumentDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        employee={employee}
        onDocumentAdded={handleDocumentAdded}
        onSuccess={() => {
        }}
      />
      
      <AlertDialog 
        open={!!documentToDelete} 
        onOpenChange={(open) => !open && setDocumentToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le document "{documentToDelete?.name}" ?
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDocument}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DocumentsTab;
