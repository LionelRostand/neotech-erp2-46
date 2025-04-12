
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Employee, Document } from '@/types/employee';
import { FileText, Plus, Trash2, Download, Eye, Info } from 'lucide-react';
import { toast } from 'sonner';
import { getEmployeeDocuments, removeEmployeeDocument } from '../services/documentService';
import UploadDocumentDialog from '../../documents/components/UploadDocumentDialog';
import { downloadFile, viewDocument, hexToDataUrl, getDocumentDataSource } from '@/utils/documentUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DocumentsTabProps {
  employee: Employee;
  onEmployeeUpdate?: (updatedEmployee: Employee) => void;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ employee, onEmployeeUpdate }) => {
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
  
  const formatFileSize = (size?: number) => {
    if (!size) return 'N/A';
    
    if (size < 1024) {
      return `${size} B`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} KB`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  const handleViewDocument = (document: Document) => {
    const { data, format } = getDocumentDataSource(document);
    
    if (!data) {
      toast.error("Aucun fichier disponible pour ce document");
      return;
    }
    
    viewDocument(
      data, 
      document.name || 'Document', 
      document.fileType || 'application/octet-stream', 
      format
    );
  };
  
  const handleDownloadDocument = (document: Document) => {
    const { data, format } = getDocumentDataSource(document);
    
    if (!data) {
      toast.error("Aucun fichier disponible pour ce document");
      return;
    }
    
    // If hex data, convert to data URL
    if (format === 'hex') {
      const dataUrl = hexToDataUrl(data, document.fileType || 'application/octet-stream');
      downloadFile(dataUrl, document.name || 'document');
    } else {
      // Base64 data or URL
      downloadFile(data, document.name || 'document');
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
  
  // Fonction pour rafraîchir sans mettre à jour tout l'employé
  const handleDocumentAdded = () => {
    fetchDocuments();
  };
  
  // Obtenir le libellé du type de stockage
  const getStorageTypeLabel = (document: Document) => {
    if (document.storedInHrDocuments) {
      let format = '';
      if (document.storageFormat === 'base64') {
        format = ' (base64)';
      } else if (document.storageFormat === 'binary') {
        format = ' (binaire)';
      } else if (document.storageFormat === 'hex') {
        format = ' (hex)';
      }
      return <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded-md text-xs">HR Documents{format}</span>;
    } else if (document.storedInFirebase) {
      return <span className="text-green-600 bg-green-50 px-2 py-1 rounded-md text-xs">Firebase</span>;
    } else {
      return <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs">Local</span>;
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
                  <TableHead>Taille</TableHead>
                  <TableHead>Stockage</TableHead>
                  <TableHead>ID</TableHead>
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
                    <TableCell>{formatFileSize(document.fileSize)}</TableCell>
                    <TableCell>
                      {getStorageTypeLabel(document)}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              <span className="truncate max-w-[80px] text-xs text-gray-500">
                                {document.documentId ? document.documentId.substring(0, 8) + '...' : 'N/A'}
                              </span>
                              <Info className="h-3 w-3 ml-1 text-gray-400" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs break-all">
                              {document.documentId || 'Aucun ID de référence'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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
        onDocumentAdded={handleDocumentAdded}
      />
    </div>
  );
};

export default DocumentsTab;
