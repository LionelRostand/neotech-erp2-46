
import React, { useState } from 'react';
import { useDocumentService } from '../../documents/services/documentService';
import { DocumentFile, SearchParams } from '../../documents/types/document-types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { 
  Search, 
  FileText, 
  Calendar, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  FileArchive,
  FileImage,
  FileCode,
  Download,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { formatFileSize } from '../../documents/utils/formatUtils';
import { SearchResults } from '../../documents/components/SearchResults';
import { DocumentPreview } from '../../documents/components/DocumentPreview';

const DocumentsSearch: React.FC = () => {
  const { searchDocuments } = useDocumentService();
  
  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: '',
    status: 'active'
  });
  const [results, setResults] = useState<DocumentFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentFile | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Handle search
  const handleSearch = async () => {
    setLoading(true);
    setHasSearched(true);
    
    try {
      const searchResults = await searchDocuments({
        ...searchParams,
        userId: 'current-user', // In a real app, this would be the current user ID
      });
      
      setResults(searchResults);
      setSelectedDocument(null);
      
      if (searchResults.length === 0) {
        toast.info('Aucun résultat trouvé pour cette recherche');
      } else {
        toast.success(`${searchResults.length} résultat${searchResults.length > 1 ? 's' : ''} trouvé${searchResults.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      console.error('Error searching documents:', error);
      toast.error('Erreur lors de la recherche de documents');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Update search params
  const updateSearchParam = (key: keyof SearchParams, value: string | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Clear search
  const clearSearch = () => {
    setSearchParams({
      query: '',
      status: 'active'
    });
    setResults([]);
    setSelectedDocument(null);
    setHasSearched(false);
  };
  
  // Get icon for document based on format
  const getDocumentIcon = (document: DocumentFile) => {
    const format = document.format.toLowerCase();
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(format)) {
      return <FileImage className="h-4 w-4 mr-2 text-blue-500" />;
    }
    
    if (['pdf'].includes(format)) {
      return <FileText className="h-4 w-4 mr-2 text-red-500" />;
    }
    
    if (['html', 'css', 'js', 'ts', 'json', 'xml'].includes(format)) {
      return <FileCode className="h-4 w-4 mr-2 text-green-500" />;
    }
    
    if (document.status === 'archived') {
      return <FileArchive className="h-4 w-4 mr-2 text-amber-500" />;
    }
    
    return <FileText className="h-4 w-4 mr-2 text-gray-500" />;
  };
  
  return (
    <div className="space-y-4">
      {/* Search form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recherche avancée</CardTitle>
          <CardDescription>
            Recherchez des documents par nom, contenu, format, date et plus encore
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Basic search */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  placeholder="Rechercher des documents..."
                  value={searchParams.query || ''}
                  onChange={(e) => updateSearchParam('query', e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSearch} disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                      Recherche...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Rechercher
                    </>
                  )}
                </Button>
                
                <Button variant="outline" onClick={clearSearch} disabled={loading}>
                  Effacer
                </Button>
              </div>
            </div>
            
            {/* Advanced search */}
            <Collapsible
              open={isAdvancedSearch}
              onOpenChange={setIsAdvancedSearch}
              className="border rounded-md p-4"
            >
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex w-full justify-between p-2">
                  <span className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres avancés
                  </span>
                  {isAdvancedSearch ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status filter */}
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select 
                      value={searchParams.status || 'all'} 
                      onValueChange={(value) => updateSearchParam('status', value === 'all' ? undefined : value as any)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="active">Actifs</SelectItem>
                        <SelectItem value="archived">Archivés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Format filter */}
                  <div className="space-y-2">
                    <Label htmlFor="format">Format</Label>
                    <Select 
                      value={searchParams.format || 'all'} 
                      onValueChange={(value) => updateSearchParam('format', value === 'all' ? undefined : value)}
                    >
                      <SelectTrigger id="format">
                        <SelectValue placeholder="Tous les formats" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les formats</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="docx">Word (DOCX)</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                        <SelectItem value="jpg">Image (JPG)</SelectItem>
                        <SelectItem value="png">Image (PNG)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Tag filter */}
                  <div className="space-y-2">
                    <Label htmlFor="tag">Tag</Label>
                    <Input
                      id="tag"
                      placeholder="Entrez un tag"
                      value={searchParams.tag || ''}
                      onChange={(e) => updateSearchParam('tag', e.target.value || undefined)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date range */}
                  <div className="space-y-2">
                    <Label htmlFor="dateFrom">Date de début</Label>
                    <Input
                      id="dateFrom"
                      type="date"
                      value={searchParams.dateFrom || ''}
                      onChange={(e) => updateSearchParam('dateFrom', e.target.value || undefined)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateTo">Date de fin</Label>
                    <Input
                      id="dateTo"
                      type="date"
                      value={searchParams.dateTo || ''}
                      onChange={(e) => updateSearchParam('dateTo', e.target.value || undefined)}
                    />
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardContent>
      </Card>
      
      {/* Search results */}
      {hasSearched && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Results list */}
          <div className={selectedDocument ? "lg:col-span-2" : "lg:col-span-3"}>
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span>Résultats de recherche</span>
                  <Badge variant="outline" className="ml-2">
                    {results.length} document{results.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {results.length > 0 
                    ? `Résultats de recherche pour "${searchParams.query || 'tous les documents'}"`
                    : 'Aucun résultat trouvé'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SearchResults 
                  results={results} 
                  isLoading={loading}
                  onSelect={setSelectedDocument}
                  selectedDocument={selectedDocument}
                  getDocumentIcon={getDocumentIcon}
                />
              </CardContent>
            </Card>
          </div>
          
          {/* Document preview */}
          {selectedDocument && (
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-base">
                    {getDocumentIcon(selectedDocument)}
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
                  <DocumentPreview document={selectedDocument} />
                  
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                    <Button size="sm" variant="outline" className="w-full">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Ouvrir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentsSearch;
