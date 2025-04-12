
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/employee';
import { FileText, Download, Upload, Calendar, FilePen, FileArchive, FileImage, File, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import UploadDocumentDialog from '../../documents/components/UploadDocumentDialog';
import { getEmployeeDocuments, removeEmployeeDocument, EmployeeDocument } from '../services/documentService';

interface DocumentsTabProps {
  documents?: EmployeeDocument[] | string[];
  employee?: Employee;
}

const DocumentsTab: React.FC<DocumentsTabProps> = ({ documents: initialDocuments = [], employee }) => {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadDocumentType, setUploadDocumentType] = useState('');
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Charger les documents
  useEffect(() => {
    const fetchDocuments = async () => {
      if (employee?.id) {
        setLoading(true);
        try {
          const docs = await getEmployeeDocuments(employee.id);
          setDocuments(docs);
        } catch (error) {
          console.error('Erreur lors du chargement des documents:', error);
          toast.error('Erreur lors du chargement des documents');
        } finally {
          setLoading(false);
        }
      } else if (initialDocuments && initialDocuments.length > 0) {
        // Utiliser les documents fournis en props
        setDocuments(initialDocuments.map(processDocument));
      }
    };

    fetchDocuments();
  }, [employee, initialDocuments]);

  const handleUpload = () => {
    setUploadDocumentType('');
    setUploadDialogOpen(true);
  };

  const handleUploadSuccess = () => {
    // Actualiser la liste des documents
    if (employee?.id) {
      getEmployeeDocuments(employee.id)
        .then(docs => {
          setDocuments(docs);
        })
        .catch(error => {
          console.error('Erreur lors de l\'actualisation des documents:', error);
        });
    }
  };

  const handleDownload = (document: EmployeeDocument | string) => {
    const processedDoc = typeof document === 'string' ? processDocument(document) : document;
    if (processedDoc.fileUrl) {
      window.open(processedDoc.fileUrl, '_blank');
    } else {
      toast.error("URL du document non disponible");
    }
  };

  const handleDelete = (id: string) => {
    setSelectedDocumentId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDocumentId || !employee?.id) {
      setDeleteDialogOpen(false);
      return;
    }

    try {
      const success = await removeEmployeeDocument(employee.id, selectedDocumentId);
      if (success) {
        // Mettre à jour la liste de documents locale
        setDocuments(prev => prev.filter(doc => doc.id !== selectedDocumentId));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Erreur lors de la suppression du document");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDocumentId(null);
    }
  };

  // Function to convert a string to a Document object if needed
  const processDocument = (doc: EmployeeDocument | string): EmployeeDocument => {
    if (typeof doc === 'string') {
      return {
        name: doc,
        date: new Date().toISOString(),
        type: 'autre'
      };
    }
    return doc;
  };

  // Group documents by month
  const groupedDocuments = documents.reduce((acc, doc) => {
    try {
      const date = new Date(doc.date);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      
      const month = format(date, 'MMMM yyyy', { locale: fr });
      
      if (!acc[month]) {
        acc[month] = [];
      }
      
      acc[month].push(doc);
    } catch (e) {
      // If date format is invalid, group under "Non daté"
      if (!acc["Non daté"]) {
        acc["Non daté"] = [];
      }
      acc["Non daté"].push(doc);
    }
    return acc;
  }, {} as Record<string, EmployeeDocument[]>);

  // Sort months in descending order (newest first)
  const sortedMonths = Object.keys(groupedDocuments).sort((a, b) => {
    if (a === "Non daté") return 1;
    if (b === "Non daté") return -1;
    
    const dateA = new Date(a.replace('janvier', 'January').replace('février', 'February')
      .replace('mars', 'March').replace('avril', 'April').replace('mai', 'May')
      .replace('juin', 'June').replace('juillet', 'July').replace('août', 'August')
      .replace('septembre', 'September').replace('octobre', 'October')
      .replace('novembre', 'November').replace('décembre', 'December'));
    const dateB = new Date(b.replace('janvier', 'January').replace('février', 'February')
      .replace('mars', 'March').replace('avril', 'April').replace('mai', 'May')
      .replace('juin', 'June').replace('juillet', 'July').replace('août', 'August')
      .replace('septembre', 'September').replace('octobre', 'October')
      .replace('novembre', 'November').replace('décembre', 'December'));
    
    if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
      return 0;
    }
    
    return dateB.getTime() - dateA.getTime();
  });

  // Get appropriate icon for document type
  const getDocumentTypeIcon = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('contrat')) return <FilePen className="w-5 h-5 text-primary" />;
    if (lowerType.includes('avenant')) return <FileText className="w-5 h-5 text-primary" />;
    if (lowerType.includes('formulaire')) return <FileArchive className="w-5 h-5 text-primary" />;
    if (lowerType.includes('identité') || lowerType.includes('identite')) return <FileImage className="w-5 h-5 text-primary" />;
    if (lowerType.includes('diplôme') || lowerType.includes('diplome')) return <File className="w-5 h-5 text-primary" />;
    if (lowerType.includes('cv')) return <File className="w-5 h-5 text-primary" />;
    return <FileText className="w-5 h-5 text-primary" />;
  };

  // Format date properly to avoid displaying zeros
  const formatDocumentDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return format(date, 'P', { locale: fr });
    } catch (error) {
      return '';
    }
  };

  // Format file size
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documents</h3>
        {employee?.id && (
          <Button size="sm" onClick={handleUpload}>
            <Upload className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-md bg-gray-50">
          <FileText className="w-12 h-12 mx-auto text-gray-400" />
          <p className="mt-2 text-gray-500">Aucun document trouvé</p>
          {employee?.id && (
            <Button variant="outline" size="sm" className="mt-4" onClick={handleUpload}>
              Importer un document
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {sortedMonths.map(month => (
            <div key={month} className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500 flex items-center border-b pb-1">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                {month.charAt(0).toUpperCase() + month.slice(1)}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {groupedDocuments[month].map((doc, index) => (
                  <div 
                    key={doc.id || index} 
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <div className="bg-primary-50 p-2 rounded mr-3">
                        {getDocumentTypeIcon(doc.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate" title={doc.name}>
                          {doc.name}
                        </p>
                        <div className="flex flex-wrap items-center text-xs text-gray-500 gap-2">
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                          {doc.date && formatDocumentDate(doc.date) && (
                            <span>
                              {formatDocumentDate(doc.date)}
                            </span>
                          )}
                          {doc.fileSize && (
                            <span className="text-gray-400">
                              {formatFileSize(doc.fileSize)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)} title="Télécharger">
                        <Download className="w-4 h-4" />
                      </Button>
                      {employee?.id && (
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(doc.id!)} className="text-red-500 hover:text-red-700" title="Supprimer">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Document Dialog */}
      {employee?.id && (
        <UploadDocumentDialog 
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          onSuccess={handleUploadSuccess}
          defaultType={uploadDocumentType}
          employeeId={employee.id}
        />
      )}

      {/* Confirm Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer le document</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce document ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DocumentsTab;
