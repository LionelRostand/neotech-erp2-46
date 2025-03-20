
import React, { useState, useEffect } from 'react';
import { useDocumentService } from '../../documents/services/documentService';
import { DocumentFile } from '../../documents/types/document-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, Archive, RefreshCw, AlertCircle, FileArchive, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { ArchiveEmptyState } from '../../documents/components/ArchiveEmptyState';
import { formatFileSize } from '../../documents/utils/formatUtils';

const DocumentsArchive: React.FC = () => {
  const { getAllUserDocuments, restoreDocument } = useDocumentService();
  
  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  
  // Fetch archived documents
  useEffect(() => {
    const fetchArchivedDocuments = async () => {
      setLoading(true);
      try {
        const docs = await getAllUserDocuments('current-user', 'archived');
        setDocuments(docs);
      } catch (error) {
        console.error('Error fetching archived documents:', error);
        toast.error('Erreur lors de la récupération des documents archivés');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArchivedDocuments();
  }, [getAllUserDocuments]);
  
  // Filter documents by search query
  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Select/deselect all documents
  const toggleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };
  
  // Toggle document selection
  const toggleDocumentSelection = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(prev => prev.filter(docId => docId !== id));
    } else {
      setSelectedDocuments(prev => [...prev, id]);
    }
  };
  
  // Restore selected documents
  const handleRestoreSelected = async () => {
    if (selectedDocuments.length === 0) {
      toast.warning('Aucun document sélectionné');
      return;
    }
    
    // Create a copy to track progress
    const toRestore = [...selectedDocuments];
    
    // Show toast for starting restore
    toast.info(`Restauration de ${toRestore.length} document${toRestore.length > 1 ? 's' : ''}...`);
    
    // Track success and failures
    let successCount = 0;
    
    // Process documents sequentially
    for (const docId of toRestore) {
      try {
        const success = await restoreDocument(docId);
        if (success) {
          successCount++;
        }
      } catch (error) {
        console.error(`Error restoring document ${docId}:`, error);
      }
    }
    
    // Update UI
    if (successCount > 0) {
      setDocuments(prev => prev.filter(doc => !selectedDocuments.includes(doc.id)));
      setSelectedDocuments([]);
      
      toast.success(
        `${successCount} document${successCount > 1 ? 's' : ''} restauré${successCount > 1 ? 's' : ''} avec succès`
      );
    }
    
    if (successCount < toRestore.length) {
      const failCount = toRestore.length - successCount;
      toast.error(
        `Échec de la restauration de ${failCount} document${failCount > 1 ? 's' : ''}`
      );
    }
  };
  
  return (
    <div className="space-y-4">
      {/* Header with search and restore buttons */}
      <div className="flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Rechercher dans les archives..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            disabled={selectedDocuments.length === 0}
            onClick={handleRestoreSelected}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Restaurer ({selectedDocuments.length})
          </Button>
        </div>
      </div>
      
      {/* Archive notice */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-700">À propos des archives</h4>
              <p className="text-sm text-blue-600 mt-1">
                Les documents archivés sont conservés pendant 1 an avant d'être supprimés définitivement.
                Vous pouvez restaurer des documents à tout moment pendant cette période.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Archives content */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Documents archivés</span>
            <Badge variant="outline" className="ml-2">
              {filteredDocuments.length} fichier{filteredDocuments.length !== 1 ? 's' : ''}
            </Badge>
          </CardTitle>
          <CardDescription>
            Gérez vos documents archivés et restaurez-les si nécessaire
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-2 text-sm text-muted-foreground">Chargement des archives...</p>
              </div>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <ArchiveEmptyState searchQuery={searchQuery} />
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox 
                        checked={selectedDocuments.length === filteredDocuments.length && filteredDocuments.length > 0} 
                        onCheckedChange={toggleSelectAll}
                        aria-label="Sélectionner tous les documents"
                      />
                    </TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Archivé le</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedDocuments.includes(doc.id)} 
                          onCheckedChange={() => toggleDocumentSelection(doc.id)}
                          aria-label={`Sélectionner ${doc.name}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <FileArchive className="h-4 w-4 mr-2 text-muted-foreground" />
                          {doc.name}
                        </div>
                      </TableCell>
                      <TableCell>{formatFileSize(doc.size)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {doc.archivedAt ? format(new Date(doc.archivedAt), 'Pp', { locale: fr }) : '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{doc.format.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            restoreDocument(doc.id).then(success => {
                              if (success) {
                                setDocuments(prev => prev.filter(d => d.id !== doc.id));
                                setSelectedDocuments(prev => prev.filter(id => id !== doc.id));
                              }
                            });
                          }}
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Restaurer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsArchive;
