
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
  Filter, 
  Edit, 
  Trash2, 
  Mail, 
  Download,
  Eye,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CreateInvoiceDialog from './CreateInvoiceDialog';
import ViewInvoiceDialog from './ViewInvoiceDialog';
import { Invoice } from '@/types/freight';

// Sample invoices data
const mockInvoices: Invoice[] = [
  {
    id: 'INV-2025-001',
    reference: 'FR-2025-001',
    clientName: 'Dupont Industries',
    clientId: 'client-1',
    createdAt: new Date('2025-03-10').toISOString(),
    dueDate: new Date('2025-04-10').toISOString(),
    status: 'paid',
    totalAmount: 1250.75,
    items: [
      { id: '1', description: 'Transport routier national', quantity: 1, unitPrice: 850, total: 850 },
      { id: '2', description: 'Assurance marchandise', quantity: 1, unitPrice: 150, total: 150 },
      { id: '3', description: 'Frais de manutention', quantity: 3, unitPrice: 83.58, total: 250.75 }
    ],
    shipmentId: 'SHP-2025-001',
    paymentDetails: {
      method: 'bank_transfer',
      date: new Date('2025-03-20').toISOString(),
      transactionId: 'TRX12345'
    }
  },
  {
    id: 'INV-2025-002',
    reference: 'FR-2025-002',
    clientName: 'Martin Export',
    clientId: 'client-2',
    createdAt: new Date('2025-03-15').toISOString(),
    dueDate: new Date('2025-04-15').toISOString(),
    status: 'unpaid',
    totalAmount: 3845.50,
    items: [
      { id: '1', description: 'Transport maritime international', quantity: 1, unitPrice: 3200, total: 3200 },
      { id: '2', description: 'Documentation douanière', quantity: 1, unitPrice: 245.50, total: 245.50 },
      { id: '3', description: 'Frais portuaires', quantity: 1, unitPrice: 400, total: 400 }
    ],
    shipmentId: 'SHP-2025-002'
  },
  {
    id: 'INV-2025-003',
    reference: 'FR-2025-003',
    clientName: 'Tech Innovations',
    clientId: 'client-4',
    createdAt: new Date('2025-02-25').toISOString(),
    dueDate: new Date('2025-03-25').toISOString(),
    status: 'overdue',
    totalAmount: 5280.00,
    items: [
      { id: '1', description: 'Transport aérien express', quantity: 1, unitPrice: 4800, total: 4800 },
      { id: '2', description: 'Assurance premium', quantity: 1, unitPrice: 480, total: 480 }
    ],
    shipmentId: 'SHP-2025-003'
  },
  {
    id: 'INV-2025-004',
    reference: 'FR-2025-004',
    clientName: 'Petit Commerce',
    clientId: 'client-3',
    createdAt: new Date('2025-03-01').toISOString(),
    dueDate: new Date('2025-04-01').toISOString(),
    status: 'cancelled',
    totalAmount: 435.25,
    items: [
      { id: '1', description: 'Livraison locale', quantity: 1, unitPrice: 375, total: 375 },
      { id: '2', description: 'Emballage spécial', quantity: 1, unitPrice: 60.25, total: 60.25 }
    ],
    shipmentId: 'SHP-2025-004',
    cancelReason: 'Commande annulée par le client'
  },
  {
    id: 'INV-2025-005',
    reference: 'FR-2025-005',
    clientName: 'Mobilier Moderne',
    clientId: 'client-5',
    createdAt: new Date('2025-03-28').toISOString(),
    dueDate: new Date('2025-04-28').toISOString(),
    status: 'partially_paid',
    totalAmount: 2145.30,
    paidAmount: 1000,
    items: [
      { id: '1', description: 'Transport routier national', quantity: 1, unitPrice: 1850, total: 1850 },
      { id: '2', description: 'Service de montage', quantity: 3, unitPrice: 98.43, total: 295.30 }
    ],
    shipmentId: 'SHP-2025-005',
    paymentDetails: {
      method: 'card',
      date: new Date('2025-03-29').toISOString(),
      transactionId: 'TRX67890'
    }
  }
];

const InvoicesManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const { toast } = useToast();

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.reference.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter ? invoice.status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });

  const handleDeleteInvoice = (id: string) => {
    toast({
      title: "Facture supprimée",
      description: `La facture ${id} a été supprimée.`,
    });
  };

  const handleSendInvoice = (id: string) => {
    toast({
      title: "Facture envoyée",
      description: `La facture ${id} a été envoyée par email.`,
    });
  };

  const handleDownloadInvoice = (id: string) => {
    toast({
      title: "Téléchargement démarré",
      description: `La facture ${id} est en cours de téléchargement.`,
    });
  };

  const handleMarkAsPaid = (id: string) => {
    toast({
      title: "Facture marquée comme payée",
      description: `La facture ${id} a été marquée comme payée.`,
    });
  };

  const handleSendReminder = (id: string) => {
    toast({
      title: "Rappel envoyé",
      description: `Un rappel a été envoyé pour la facture ${id}.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Payée</Badge>;
      case 'unpaid':
        return <Badge variant="outline">Non payée</Badge>;
      case 'partially_paid':
        return <Badge className="bg-blue-500">Partiellement payée</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500">En retard</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-500">Annulée</Badge>;
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
            <h2 className="text-xl font-semibold">Gestion des factures</h2>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle facture
          </Button>
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex gap-3 items-center">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  {statusFilter ? `Filtré: ${statusFilter}` : 'Filtrer par statut'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Statut de facture</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                  Tous
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('paid')}>
                  Payée
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('unpaid')}>
                  Non payée
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('partially_paid')}>
                  Partiellement payée
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('overdue')}>
                  En retard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter('cancelled')}>
                  Annulée
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Numéro</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date d'émission</TableHead>
                <TableHead>Date d'échéance</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.reference}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{format(new Date(invoice.createdAt), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                    <TableCell>{format(new Date(invoice.dueDate), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                    <TableCell>{invoice.totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={() => setSelectedInvoice(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                          <Button size="icon" variant="ghost" onClick={() => handleMarkAsPaid(invoice.id)}>
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {(invoice.status === 'unpaid' || invoice.status === 'overdue' || invoice.status === 'partially_paid') && (
                          <Button size="icon" variant="ghost" onClick={() => handleSendReminder(invoice.id)}>
                            <AlertTriangle className="h-4 w-4" />
                          </Button>
                        )}
                        {invoice.status !== 'cancelled' && (
                          <Button size="icon" variant="ghost" onClick={() => handleSendInvoice(invoice.id)}>
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="icon" variant="ghost" onClick={() => handleDownloadInvoice(invoice.id)}>
                          <Download className="h-4 w-4" />
                        </Button>
                        {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteInvoice(invoice.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    Aucun résultat trouvé.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      {showCreateDialog && (
        <CreateInvoiceDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
        />
      )}
      
      {selectedInvoice && (
        <ViewInvoiceDialog
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
        />
      )}
    </Card>
  );
};

export default InvoicesManager;
