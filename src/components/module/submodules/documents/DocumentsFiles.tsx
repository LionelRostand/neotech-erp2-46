
import React, { useState, useEffect } from 'react';
import { useDocumentService } from '../../documents/services';
import { DocumentFile } from '../../documents/types/document-types';
import { DocumentPermissionsDialog } from '../../documents/components/DocumentPermissionsDialog';
import { toast } from 'sonner';

// Import new components
import SearchAndFilters from './components/SearchAndFilters';
import UploadingFilesList from './components/UploadingFilesList';
import DocumentsLayout from './components/DocumentsLayout';
import DocumentSidebar from './components/DocumentSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUser, FileText, Files } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Import hooks
import { useDocumentFilters } from './hooks/useDocumentFilters';
import { useDocumentUpload } from './hooks/useDocumentUpload';

const DocumentsFiles: React.FC = () => {
  const { getAllUserDocuments, deleteDocument } = useDocumentService();
  
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  
  // Use custom hooks
  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    sortDirection,
    handleSort,
    view,
    setView,
    filteredDocuments
  } = useDocumentFilters(documents);
  
  const {
    uploadingFiles,
    fileInputRef,
    triggerFileInput,
    handleFileUpload
  } = useDocumentUpload((uploadedDocs) => {
    setDocuments(prev => [...prev, ...uploadedDocs]);
  });
  
  useEffect(() => {
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

  // Filter CV documents
  const cvDocuments = documents.filter(doc => 
    doc.name?.toLowerCase().includes('cv') || 
    doc.type?.toLowerCase() === 'cv'
  );
  
  // Filter Contract documents
  const contractDocuments = documents.filter(doc => 
    doc.name?.toLowerCase().includes('contrat') || 
    doc.type?.toLowerCase() === 'contrat' ||
    doc.type?.toLowerCase() === 'contract'
  );
  
  return (
    <div className="space-y-4">
      <SearchAndFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        sortBy={sortBy}
        sortDirection={sortDirection}
        handleSort={handleSort}
        view={view}
        setView={setView}
        onUploadClick={triggerFileInput}
      />
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => handleFileUpload(e.target.files)}
        style={{ display: 'none' }}
        multiple
      />
      
      <UploadingFilesList uploadingFiles={uploadingFiles} />
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">
            <Files className="h-4 w-4 mr-2" />
            Tous les documents <Badge variant="secondary" className="ml-2">{documents.length}</Badge>
          </TabsTrigger>
          
          <TabsTrigger value="cv">
            <FileUser className="h-4 w-4 mr-2" />
            CV <Badge variant="secondary" className="ml-2">{cvDocuments.length}</Badge>
          </TabsTrigger>
          
          <TabsTrigger value="contrats">
            <FileText className="h-4 w-4 mr-2" />
            Contrats <Badge variant="secondary" className="ml-2">{contractDocuments.length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <DocumentsLayout
                documents={filteredDocuments}
                loading={loading}
                view={view}
                onSelect={setSelectedDocument}
                onDelete={handleDeleteDocument}
                selectedDocumentId={selectedDocument?.id}
              />
            </div>
            
            <div className="lg:col-span-1">
              <DocumentSidebar
                selectedDocument={selectedDocument}
                onPermissionsClick={() => setShowPermissionsDialog(true)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="cv" className="pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <DocumentsLayout
                documents={cvDocuments.filter(doc => 
                  searchQuery ? 
                    doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    doc.type?.toLowerCase().includes(searchQuery.toLowerCase()) : 
                    true
                )}
                loading={loading}
                view={view}
                onSelect={setSelectedDocument}
                onDelete={handleDeleteDocument}
                selectedDocumentId={selectedDocument?.id}
              />
            </div>
            
            <div className="lg:col-span-1">
              <DocumentSidebar
                selectedDocument={selectedDocument}
                onPermissionsClick={() => setShowPermissionsDialog(true)}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="contrats" className="pt-2">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <DocumentsLayout
                documents={contractDocuments.filter(doc => 
                  searchQuery ? 
                    doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    doc.type?.toLowerCase().includes(searchQuery.toLowerCase()) : 
                    true
                )}
                loading={loading}
                view={view}
                onSelect={setSelectedDocument}
                onDelete={handleDeleteDocument}
                selectedDocumentId={selectedDocument?.id}
              />
            </div>
            
            <div className="lg:col-span-1">
              <DocumentSidebar
                selectedDocument={selectedDocument}
                onPermissionsClick={() => setShowPermissionsDialog(true)}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
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
