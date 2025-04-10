
import React, { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Download, Trash2, Check, Loader2 } from 'lucide-react';
import { getEmployeeDocuments, EmployeeDocument, deleteEmployeeDocument } from '../services/documentService';
import UploadDocumentDialog from './components/UploadDocumentDialog';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface DocumentsTabProps {
  employee: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee }) => {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<EmployeeDocument | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [employee.id]);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const fetchedDocuments = await getEmployeeDocuments(employee.id);
      setDocuments(fetchedDocuments);
    } catch (error) {
      console.error("Erreur lors du chargement des documents:", error);
      toast.error("Erreur lors du chargement des documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    loadDocuments();
  };

  const handleOpenDeleteDialog = (document: EmployeeDocument) => {
    setDocumentToDelete(document);
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    setIsDeleting(true);
    try {
      const success = await deleteEmployeeDocument(
        documentToDelete.id!, 
        employee.id, 
        documentToDelete.fileUrl
      );
      
      if (success) {
        toast.success("Document supprimé avec succès");
        loadDocuments();
      } else {
        toast.error("Erreur lors de la suppression du document");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du document:", error);
      toast.error("Erreur lors de la suppression du document");
    } finally {
      setIsDeleting(false);
      setDocumentToDelete(null);
    }
  };

  const renderDocumentType = (type: string) => {
    switch (type) {
      case 'contrat':
        return 'Contrat de travail';
      case 'avenant':
        return 'Avenant';
      case 'attestation':
        return 'Attestation';
      case 'formulaire':
        return 'Formulaire';
      case 'identite':
        return 'Pièce d\'identité';
      case 'diplome':
        return 'Diplôme';
      case 'cv':
        return 'CV';
      case 'formation':
        return 'Formation';
      case 'certification':
        return 'Certification';
      default:
        return 'Autre document';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Documents</CardTitle>
          <Button 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={() => setIsUploadDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Ajouter un document
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun document disponible</p>
              <p className="text-sm mt-1">Cliquez sur 'Ajouter un document' pour commencer.</p>
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
                    <TableCell>{renderDocumentType(document.type)}</TableCell>
                    <TableCell>{new Date(document.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" asChild>
                        <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleOpenDeleteDialog(document)}
                      >
                        <Trash2 className="h-4 w-4" />
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
        open={isUploadDialogOpen}
        onOpenChange={setIsUploadDialogOpen}
        onSuccess={handleUploadSuccess}
        employeeId={employee.id}
      />

      <AlertDialog open={documentToDelete !== null} onOpenChange={(open) => !open && setDocumentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce document ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteDocument}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DocumentsTab;
