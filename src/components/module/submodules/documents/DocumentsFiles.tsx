import React, { useState, useCallback, useRef } from 'react';
import { useDocumentService } from '../../documents/services';
import { DocumentFile, FileUploadState } from '../../documents/types/document-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileUploader } from '../../documents/components/FileUploader';
import { DocumentsList } from '../../documents/components/DocumentsList';
import { DocumentPreview } from '../../documents/components/DocumentPreview';
import { DocumentPermissionsDialog } from '../../documents/components/DocumentPermissionsDialog';
import { 
  Cloud, 
  File, 
  FileUp, 
  FolderUp, 
  Search, 
  SortAsc,
  SortDesc,
  Tag,
  Filter
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const DocumentsFiles: React.FC = () => {
  const { 
    uploadMultipleDocuments, 
    getAllUserDocuments,
    deleteDocument
  } = useDocumentService();
  
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<FileUploadState[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const docs = await getAllUserDocuments('current-user');
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast.error('Erreur lors de la récupération des documents');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [getAllUserDocuments]);
  
  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const fileStates: FileUploadState[] = Array.from(files).map(file => ({
      file,
      progress: 0,
      status: 'pending'
    }));
    
    setUploadingFiles(fileStates);
    
    const updateProgress = (index: number, progress: number) => {
      setUploadingFiles(prev => {
        const newState = [...prev];
        newState[index] = { ...newState[index], progress, status: 'uploading' };
        return newState;
      });
    };
    
    const progressIntervals = Array.from(files).map((_, index) => {
      return setInterval(() => {
        updateProgress(index, Math.min(95, Math.random() * 20 + (fileStates[index]?.progress || 0)));
      }, 300);
    });
    
    try {
      const uploadedDocs = await uploadMultipleDocuments(Array.from(files));
      
      progressIntervals.forEach(clearInterval);
      
      setUploadingFiles(prev => prev.map((file, index) => ({
        ...file,
        progress: 100,
        status: uploadedDocs[index] ? 'success' : 'error',
        errorMessage: uploadedDocs[index] ? undefined : 'Erreur lors du téléversement'
      })));
      
      setDocuments(prev => [
        ...prev,
        ...uploadedDocs.filter(Boolean) as DocumentFile[]
      ]);
      
      setTimeout(() => {
        setUploadingFiles([]);
      }, 3000);
      
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Erreur lors du téléversement des fichiers');
      
      progressIntervals.forEach(clearInterval);
      
      setUploadingFiles(prev => prev.map(file => ({
        ...file,
        progress: 100,
        status: 'error',
        errorMessage: 'Erreur lors du téléversement'
      })));
    }
  }, [uploadMultipleDocuments]);
  
  const filteredDocuments = React.useMemo(() => {
    return documents
      .filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => {
        if (sortBy === 'name') {
          return sortDirection === 'asc' 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        } else if (sortBy === 'size') {
          return sortDirection === 'asc'
            ? a.size - b.size
            : b.size - a.size;
        } else {
          return sortDirection === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [documents, searchQuery, sortBy, sortDirection]);
  
  const handleSort = (by: 'name' | 'date' | 'size') => {
    if (sortBy === by) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(by);
      setSortDirection('asc');
    }
  };
  
  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      if (selectedDocument?.id === documentId) {
        setSelectedDocument(null);
      }
      toast.success('Document supprimé avec succès');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Erreur lors de la suppression du document');
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Rechercher des documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
        
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {sortDirection === 'asc' ? <SortAsc className="h-4 w-4 mr-2" /> : <SortDesc className="h-4 w-4 mr-2" />}
                Trier: {sortBy === 'name' ? 'Nom' : sortBy === 'size' ? 'Taille' : 'Date'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort('name')}>
                Nom
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('date')}>
                Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort('size')}>
                Taille
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setView(prev => prev === 'grid' ? 'list' : 'grid')}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Changer de vue
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
            multiple
          />
          
          <Button onClick={() => fileInputRef.current?.click()}>
            <FileUp className="h-4 w-4 mr-2" />
            Téléverser
          </Button>
        </div>
      </div>
      
      {uploadingFiles.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              Téléversement en cours ({uploadingFiles.filter(f => f.status === 'success').length}/{uploadingFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {uploadingFiles.map((file, index) => (
                <FileUploader key={index} file={file} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Mes documents</span>
                <Badge variant="outline" className="ml-2">
                  {filteredDocuments.length} fichier{filteredDocuments.length !== 1 ? 's' : ''}
                </Badge>
              </CardTitle>
              <CardDescription>
                Gérez et organisez tous vos documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentsList 
                documents={filteredDocuments} 
                isLoading={loading}
                view={view}
                onSelect={setSelectedDocument}
                onDelete={handleDeleteDocument}
                selected={selectedDocument?.id}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            {selectedDocument ? (
              <>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    <File className="h-5 w-5 mr-2" />
                    {selectedDocument.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedDocument.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="mr-1">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <DocumentPreview 
                    document={selectedDocument} 
                    onPermissionsClick={() => setShowPermissionsDialog(true)} 
                  />
                </CardContent>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <Cloud className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Aucun document sélectionné</h3>
                <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs">
                  Sélectionnez un document dans la liste pour afficher son aperçu et ses détails
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
      
      {showPermissionsDialog && selectedDocument && (
        <DocumentPermissionsDialog
          document={selectedDocument}
          onClose={() => setShowPermissionsDialog(false)}
          onUpdate={(updatedDoc) => {
            setDocuments(prev => prev.map(doc => 
              doc.id === updatedDoc.id ? updatedDoc : doc
            ));
            setSelectedDocument(updatedDoc);
          }}
        />
      )}
    </div>
  );
};

export default DocumentsFiles;
