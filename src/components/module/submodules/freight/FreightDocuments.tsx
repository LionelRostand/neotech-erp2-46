
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DocumentsList } from '@/components/module/documents/components/DocumentsList';
import { FileSearch, FileText, Plus, Filter, Upload, LayoutGrid, List } from 'lucide-react';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { fetchCollectionData } from '@/hooks/fetchCollectionData';
import DocumentViewDialog from './DocumentViewDialog';
import { DocumentsEmptyState } from '@/components/module/documents/components/DocumentsEmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FreightDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  shipment: string;
  creator: string;
  size: string;
  format: string;
  url?: string;
  tags?: string[];
}

// Adding this interface to match the DocumentFile type expected by DocumentsList
interface DocumentFile {
  id: string;
  name: string;
  format: string;
  size: number;
  createdAt: string;
  updatedAt: string;
  isEncrypted: boolean;
  description: string;
  tags: string[];
  versions: any[];
  permissions: any[];
  url: string;
  type: string;
  path: string;
  createdBy: string;
  status: string;
}

const FreightDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<FreightDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<FreightDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDocument, setSelectedDocument] = useState<FreightDocument | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch documents data
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCollectionData<FreightDocument>(COLLECTIONS.FREIGHT.DOCUMENTS);
        setDocuments(data);
        setFilteredDocuments(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading documents:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les documents. Veuillez réessayer.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    loadDocuments();
  }, [toast]);

  // Filter documents based on search term and type filter
  useEffect(() => {
    if (!documents) return;
    
    let filtered = [...documents];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(term) || 
        doc.shipment.toLowerCase().includes(term) ||
        (doc.creator && doc.creator.toLowerCase().includes(term))
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }
    
    setFilteredDocuments(filtered);
  }, [documents, searchTerm, typeFilter]);

  const handleAddDocument = () => {
    toast({
      title: "Fonction en développement",
      description: "L'ajout de documents sera disponible prochainement.",
    });
  };

  const handleViewDocument = (document: FreightDocument) => {
    setSelectedDocument(document);
    setIsViewDialogOpen(true);
  };

  const handleDeleteDocument = (id: string) => {
    toast({
      title: "Fonction en développement",
      description: "La suppression de documents sera disponible prochainement.",
    });
  };

  // Convert FreightDocument to DocumentFile format for DocumentsList component
  const convertToDocumentFile = (doc: FreightDocument): DocumentFile => {
    return {
      id: doc.id,
      name: doc.name,
      format: doc.format,
      size: doc.format === 'pdf' ? 1024 * 1024 : 500 * 1024, // Fake size for demo
      createdAt: doc.date,
      updatedAt: doc.date,
      isEncrypted: false,
      description: `Document lié à l'expédition ${doc.shipment}`,
      tags: doc.tags || [],
      versions: [],
      permissions: [],
      url: doc.url || '',
      type: doc.type || 'document',
      path: `/documents/${doc.id}`,
      createdBy: doc.creator || 'System',
      status: 'active'
    };
  };

  const handleDownload = () => {
    toast({
      title: "Téléchargement lancé",
      description: "Le document sera téléchargé prochainement.",
    });
  };

  const handlePrint = () => {
    toast({
      title: "Impression lancée",
      description: "Le document sera imprimé prochainement.",
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Chargement des documents...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Documents d'Expédition</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setViewMode('list')}>
              <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-primary' : ''}`} />
            </Button>
            <Button variant="outline" onClick={() => setViewMode('grid')}>
              <LayoutGrid className={`h-4 w-4 ${viewMode === 'grid' ? 'text-primary' : ''}`} />
            </Button>
            <Button onClick={handleAddDocument}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Document
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <div className="relative">
            <FileSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un document..."
              className="pl-8 w-full lg:w-[350px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Tabs 
            value={typeFilter} 
            onValueChange={setTypeFilter}
            className="w-full lg:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="invoice">Factures</TabsTrigger>
              <TabsTrigger value="bol">Connaissements</TabsTrigger>
              <TabsTrigger value="customs">Douanes</TabsTrigger>
              <TabsTrigger value="contract">Contrats</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {filteredDocuments.length > 0 ? (
          <DocumentsList
            documents={filteredDocuments.map(convertToDocumentFile)}
            isLoading={isLoading}
            view={viewMode}
            onSelect={(doc) => handleViewDocument(documents.find(d => d.id === doc.id)!)}
            onDelete={handleDeleteDocument}
          />
        ) : (
          <DocumentsEmptyState />
        )}
      </div>

      {selectedDocument && (
        <DocumentViewDialog
          isOpen={isViewDialogOpen}
          onClose={() => setIsViewDialogOpen(false)}
          document={selectedDocument}
          onDownload={handleDownload}
          onPrint={handlePrint}
        />
      )}
    </div>
  );
};

export default FreightDocuments;
