
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  FileText, 
  Search, 
  Download, 
  Filter,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';
import { DocumentsEmptyState } from '@/components/module/documents/components/DocumentsEmptyState';

interface FreightDocument {
  id: string;
  name: string;
  type: string;
  date: string;
  shipment: string;
  creator: string;
  size: string;
  format: string;
}

const ClientDocumentsList: React.FC = () => {
  const [documents, setDocuments] = useState<FreightDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<FreightDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    const fetchClientDocuments = async () => {
      try {
        setIsLoading(true);
        const data = await fetchFreightCollectionData<FreightDocument>('DOCUMENTS');
        
        // In a real application, we would filter documents based on the client's ID
        // For this demo, we're showing all documents
        setDocuments(data);
        setFilteredDocuments(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading documents:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger vos documents. Veuillez réessayer.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    fetchClientDocuments();
  }, [toast]);

  useEffect(() => {
    if (!documents) return;
    
    let filtered = [...documents];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(term) || 
        doc.shipment.toLowerCase().includes(term)
      );
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(doc => doc.type === typeFilter);
    }
    
    setFilteredDocuments(filtered);
  }, [documents, searchTerm, typeFilter]);

  const handleDownload = (docId: string) => {
    toast({
      title: "Téléchargement lancé",
      description: "Le document sera téléchargé prochainement.",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center p-12">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Chargement de vos documents...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Rechercher un document..."
              className="pl-8 w-full lg:w-[350px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select 
              value={typeFilter} 
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type de document" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les documents</SelectItem>
                <SelectItem value="invoice">Factures</SelectItem>
                <SelectItem value="bol">Connaissements</SelectItem>
                <SelectItem value="customs">Douanes</SelectItem>
                <SelectItem value="contract">Contrats</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredDocuments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Expédition</TableHead>
                <TableHead>Format</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="flex items-center gap-2 font-medium">
                    <FileText className="h-4 w-4 text-primary" />
                    {doc.name}
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{new Date(doc.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell>{doc.shipment}</TableCell>
                  <TableCell>{doc.format}</TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDownload(doc.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <DocumentsEmptyState />
        )}
      </CardContent>
    </Card>
  );
};

export default ClientDocumentsList;
