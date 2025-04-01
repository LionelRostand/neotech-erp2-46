
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  Edit, 
  Trash2, 
  Mail, 
  FileCheck, 
  Download 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CreateQuoteDialog from './CreateQuoteDialog';
import { Quote } from '@/types/freight';

// Sample quotes data
const mockQuotes: Quote[] = [
  {
    id: 'Q-2025-001',
    clientName: 'Dupont Industries',
    clientId: 'client-1',
    createdAt: new Date('2025-03-25').toISOString(),
    validUntil: new Date('2025-04-25').toISOString(),
    status: 'pending',
    totalAmount: 1250.75,
    items: [
      { id: '1', description: 'Transport routier national', quantity: 1, unitPrice: 850, total: 850 },
      { id: '2', description: 'Assurance marchandise', quantity: 1, unitPrice: 150, total: 150 },
      { id: '3', description: 'Frais de manutention', quantity: 3, unitPrice: 83.58, total: 250.75 }
    ],
    shipmentDetails: {
      origin: 'Paris, France',
      destination: 'Lyon, France',
      estimatedDistance: 465,
      weight: 750,
      volume: 4.5
    }
  },
  {
    id: 'Q-2025-002',
    clientName: 'Martin Export',
    clientId: 'client-2',
    createdAt: new Date('2025-03-20').toISOString(),
    validUntil: new Date('2025-04-20').toISOString(),
    status: 'accepted',
    totalAmount: 3845.50,
    items: [
      { id: '1', description: 'Transport maritime international', quantity: 1, unitPrice: 3200, total: 3200 },
      { id: '2', description: 'Documentation douanière', quantity: 1, unitPrice: 245.50, total: 245.50 },
      { id: '3', description: 'Frais portuaires', quantity: 1, unitPrice: 400, total: 400 }
    ],
    shipmentDetails: {
      origin: 'Marseille, France',
      destination: 'Barcelone, Espagne',
      estimatedDistance: 552,
      weight: 2500,
      volume: 12
    },
    acceptedDate: new Date('2025-03-22').toISOString()
  },
  {
    id: 'Q-2025-003',
    clientName: 'Petit Commerce',
    clientId: 'client-3',
    createdAt: new Date('2025-03-15').toISOString(),
    validUntil: new Date('2025-04-15').toISOString(),
    status: 'expired',
    totalAmount: 435.25,
    items: [
      { id: '1', description: 'Livraison locale', quantity: 1, unitPrice: 375, total: 375 },
      { id: '2', description: 'Emballage spécial', quantity: 1, unitPrice: 60.25, total: 60.25 }
    ],
    shipmentDetails: {
      origin: 'Nantes, France',
      destination: 'Angers, France',
      estimatedDistance: 91,
      weight: 125,
      volume: 0.8
    }
  },
  {
    id: 'Q-2025-004',
    clientName: 'Tech Innovations',
    clientId: 'client-4',
    createdAt: new Date('2025-03-28').toISOString(),
    validUntil: new Date('2025-04-28').toISOString(),
    status: 'declined',
    totalAmount: 5280.00,
    items: [
      { id: '1', description: 'Transport aérien express', quantity: 1, unitPrice: 4800, total: 4800 },
      { id: '2', description: 'Assurance premium', quantity: 1, unitPrice: 480, total: 480 }
    ],
    shipmentDetails: {
      origin: 'Paris, France',
      destination: 'Berlin, Allemagne',
      estimatedDistance: 1054,
      weight: 180,
      volume: 1.2
    },
    declinedDate: new Date('2025-03-30').toISOString(),
    declineReason: 'Coût trop élevé'
  },
  {
    id: 'Q-2025-005',
    clientName: 'Mobilier Moderne',
    clientId: 'client-5',
    createdAt: new Date('2025-03-29').toISOString(),
    validUntil: new Date('2025-04-29').toISOString(),
    status: 'converted',
    totalAmount: 2145.30,
    items: [
      { id: '1', description: 'Transport routier national', quantity: 1, unitPrice: 1850, total: 1850 },
      { id: '2', description: 'Service de montage', quantity: 3, unitPrice: 98.43, total: 295.30 }
    ],
    shipmentDetails: {
      origin: 'Lille, France',
      destination: 'Strasbourg, France',
      estimatedDistance: 502,
      weight: 850,
      volume: 9.5
    },
    convertedDate: new Date('2025-03-30').toISOString(),
    invoiceId: 'INV-2025-005'
  }
];

const QuotesManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const { toast } = useToast();

  const filteredQuotes = mockQuotes.filter(quote => 
    quote.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteQuote = (id: string) => {
    toast({
      title: "Devis supprimé",
      description: `Le devis ${id} a été supprimé.`,
    });
  };

  const handleSendQuote = (id: string) => {
    toast({
      title: "Devis envoyé",
      description: `Le devis ${id} a été envoyé par email.`,
    });
  };

  const handleConvertToInvoice = (id: string) => {
    toast({
      title: "Devis converti",
      description: `Le devis ${id} a été converti en facture.`,
    });
  };

  const handleDownloadQuote = (id: string) => {
    toast({
      title: "Téléchargement démarré",
      description: `Le devis ${id} est en cours de téléchargement.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">En attente</Badge>;
      case 'accepted':
        return <Badge className="bg-green-500">Accepté</Badge>;
      case 'declined':
        return <Badge className="bg-red-500">Refusé</Badge>;
      case 'expired':
        return <Badge className="bg-amber-500">Expiré</Badge>;
      case 'converted':
        return <Badge className="bg-blue-500">Converti</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FileText className="mr-2 h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Gestion des devis</h2>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau devis
          </Button>
        </div>

        <div className="flex justify-between mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead>Valide jusqu'au</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>{quote.clientName}</TableCell>
                    <TableCell>{format(new Date(quote.createdAt), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                    <TableCell>{format(new Date(quote.validUntil), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                    <TableCell>{quote.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                    <TableCell>{getStatusBadge(quote.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {quote.status !== 'converted' && (
                          <>
                            <Button size="icon" variant="ghost" onClick={() => setSelectedQuote(quote)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => handleDeleteQuote(quote.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => handleSendQuote(quote.id)}>
                          <Mail className="h-4 w-4" />
                        </Button>
                        {quote.status === 'accepted' && (
                          <Button size="icon" variant="ghost" onClick={() => handleConvertToInvoice(quote.id)}>
                            <FileCheck className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => handleDownloadQuote(quote.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucun résultat trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {showCreateDialog && (
        <CreateQuoteDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />
      )}
    </Card>
  );
};

export default QuotesManager;
