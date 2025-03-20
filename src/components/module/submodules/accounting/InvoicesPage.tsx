
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Send, 
  MoreHorizontal, 
  FilePenLine, 
  Trash, 
  Receipt, 
  CreditCard 
} from 'lucide-react';
import { formatCurrency } from './utils/formatting';
import { Invoice, InvoiceStatus } from './types/accounting-types';

// Données mockées pour le prototype
const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'FACT-2023-0001',
    clientId: 'client1',
    clientName: 'Entreprise ABC',
    issueDate: '2023-07-01',
    dueDate: '2023-07-31',
    status: 'sent',
    items: [],
    subtotal: 3500,
    taxAmount: 700,
    total: 4200,
    currency: 'EUR',
    createdAt: '2023-07-01T10:00:00',
    updatedAt: '2023-07-01T10:00:00',
    createdBy: 'user1'
  },
  {
    id: '2',
    number: 'FACT-2023-0002',
    clientId: 'client2',
    clientName: 'Société XYZ',
    issueDate: '2023-06-15',
    dueDate: '2023-07-15',
    status: 'paid',
    items: [],
    subtotal: 5500,
    taxAmount: 1100,
    total: 6600,
    currency: 'EUR',
    createdAt: '2023-06-15T14:30:00',
    updatedAt: '2023-06-20T09:15:00',
    createdBy: 'user1'
  },
  {
    id: '3',
    number: 'FACT-2023-0003',
    clientId: 'client3',
    clientName: 'Boutique 123',
    issueDate: '2023-06-30',
    dueDate: '2023-07-30',
    status: 'overdue',
    items: [],
    subtotal: 1800,
    taxAmount: 360,
    total: 2160,
    currency: 'EUR',
    createdAt: '2023-06-30T16:45:00',
    updatedAt: '2023-06-30T16:45:00',
    createdBy: 'user1'
  },
  {
    id: '4',
    number: 'FACT-2023-0004',
    clientId: 'client4',
    clientName: 'Client Premium',
    issueDate: '2023-07-05',
    dueDate: '2023-08-04',
    status: 'draft',
    items: [],
    subtotal: 4200,
    taxAmount: 840,
    total: 5040,
    currency: 'EUR',
    createdAt: '2023-07-05T11:20:00',
    updatedAt: '2023-07-05T11:20:00',
    createdBy: 'user1'
  },
  {
    id: '5',
    number: 'FACT-2023-0005',
    clientId: 'client5',
    clientName: 'Start-up Innovante',
    issueDate: '2023-07-10',
    dueDate: '2023-08-09',
    status: 'sent',
    items: [],
    subtotal: 3200,
    taxAmount: 640,
    total: 3840,
    currency: 'EUR',
    createdAt: '2023-07-10T09:05:00',
    updatedAt: '2023-07-10T09:05:00',
    createdBy: 'user1'
  }
];

const getStatusBadge = (status: InvoiceStatus) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline">Brouillon</Badge>;
    case 'sent':
      return <Badge variant="secondary">Envoyée</Badge>;
    case 'paid':
      return <Badge variant="success">Payée</Badge>;
    case 'overdue':
      return <Badge variant="destructive">En retard</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Annulée</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const InvoicesPage: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>(mockInvoices);

  // Logique de filtrage des factures
  React.useEffect(() => {
    let filtered = mockInvoices;
    
    // Filtrer par statut
    if (activeTab !== 'all') {
      filtered = filtered.filter(invoice => invoice.status === activeTab);
    }
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(invoice => 
        invoice.number.toLowerCase().includes(term) ||
        invoice.clientName.toLowerCase().includes(term)
      );
    }
    
    setFilteredInvoices(filtered);
  }, [activeTab, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle facture
        </Button>
      </div>
      
      <Card>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center p-4 border-b">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="draft">Brouillons</TabsTrigger>
              <TabsTrigger value="sent">Envoyées</TabsTrigger>
              <TabsTrigger value="paid">Payées</TabsTrigger>
              <TabsTrigger value="overdue">En retard</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <TabsContent value={activeTab} className="m-0">
            <div className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Numéro</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Échéance</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucune facture trouvée
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.number}</TableCell>
                        <TableCell>{invoice.clientName}</TableCell>
                        <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(invoice.total)}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      
      {/* Dialogue de création de facture */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Créer une nouvelle facture</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Select>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client1">Entreprise ABC</SelectItem>
                    <SelectItem value="client2">Société XYZ</SelectItem>
                    <SelectItem value="client3">Boutique 123</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="issueDate">Date d'émission</Label>
                <Input id="issueDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <Input id="dueDate" type="date" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Numéro</Label>
                <Input id="invoiceNumber" defaultValue="FACT-2023-0006" readOnly />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Devise</Label>
                <Select defaultValue="EUR">
                  <SelectTrigger id="currency">
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">Euro (€)</SelectItem>
                    <SelectItem value="USD">Dollar US ($)</SelectItem>
                    <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select defaultValue="draft">
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="sent">Envoyée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Articles</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[100px]">Quantité</TableHead>
                  <TableHead className="w-[120px]">Prix unitaire</TableHead>
                  <TableHead className="w-[100px]">TVA (%)</TableHead>
                  <TableHead className="w-[120px] text-right">Total</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Input placeholder="Description de l'article" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" min="1" defaultValue="1" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" min="0" defaultValue="0" />
                  </TableCell>
                  <TableCell>
                    <Input type="number" min="0" max="100" defaultValue="20" />
                  </TableCell>
                  <TableCell className="text-right font-medium">0,00 €</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="text-red-500">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            <Button variant="outline" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un article
            </Button>
            
            <div className="flex justify-end">
              <div className="w-[300px] space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total:</span>
                  <span>0,00 €</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA:</span>
                  <span>0,00 €</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>0,00 €</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" placeholder="Notes ou commentaires pour la facture" />
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="secondary">
              <FilePenLine className="mr-2 h-4 w-4" /> Enregistrer comme brouillon
            </Button>
            <Button>
              <Send className="mr-2 h-4 w-4" /> Créer et envoyer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicesPage;
