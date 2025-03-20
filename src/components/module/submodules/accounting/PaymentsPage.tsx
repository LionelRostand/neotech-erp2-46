
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
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  FileText, 
  CreditCard, 
  Landmark, 
  ChevronsUpDown,
  Calendar,
  Check
} from 'lucide-react';
import { formatCurrency } from './utils/formatting';
import { Payment } from './types/accounting-types';

// Données mockées pour le prototype
const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: 'inv1',
    amount: 4200,
    date: '2023-07-05',
    method: 'bank_transfer',
    status: 'completed',
    transactionId: 'tx123456',
    currency: 'EUR',
    notes: 'Paiement reçu par virement bancaire',
    createdAt: '2023-07-05T10:30:00',
    updatedAt: '2023-07-05T10:30:00',
    createdBy: 'user1'
  },
  {
    id: '2',
    invoiceId: 'inv2',
    amount: 5600,
    date: '2023-07-03',
    method: 'stripe',
    status: 'completed',
    transactionId: 'ch_1234567890',
    currency: 'EUR',
    notes: 'Paiement par carte bancaire',
    createdAt: '2023-07-03T14:15:00',
    updatedAt: '2023-07-03T14:15:00',
    createdBy: 'user1'
  },
  {
    id: '3',
    invoiceId: 'inv3',
    amount: 1850,
    date: '2023-07-01',
    method: 'paypal',
    status: 'completed',
    transactionId: 'PP-12345678',
    currency: 'EUR',
    notes: 'Paiement reçu par PayPal',
    createdAt: '2023-07-01T09:45:00',
    updatedAt: '2023-07-01T09:45:00',
    createdBy: 'user1'
  },
  {
    id: '4',
    invoiceId: 'inv4',
    amount: 3200,
    date: '2023-06-28',
    method: 'bank_transfer',
    status: 'pending',
    currency: 'EUR',
    notes: 'En attente de confirmation bancaire',
    createdAt: '2023-06-28T16:20:00',
    updatedAt: '2023-06-28T16:20:00',
    createdBy: 'user1'
  },
  {
    id: '5',
    invoiceId: 'inv5',
    amount: 980,
    date: '2023-06-25',
    method: 'stripe',
    status: 'failed',
    transactionId: 'ch_failed123',
    currency: 'EUR',
    notes: 'Paiement refusé par la banque',
    createdAt: '2023-06-25T11:10:00',
    updatedAt: '2023-06-25T11:15:00',
    createdBy: 'user1'
  }
];

const getPaymentMethodIcon = (method: string) => {
  switch (method) {
    case 'stripe':
    case 'credit_card':
      return <CreditCard className="h-4 w-4 mr-2" />;
    case 'bank_transfer':
      return <Landmark className="h-4 w-4 mr-2" />;
    case 'paypal':
      return <CreditCard className="h-4 w-4 mr-2" />; // Use a PayPal specific icon if available
    default:
      return <CreditCard className="h-4 w-4 mr-2" />;
  }
};

const getPaymentMethodName = (method: string) => {
  switch (method) {
    case 'stripe':
      return 'Carte bancaire (Stripe)';
    case 'bank_transfer':
      return 'Virement bancaire';
    case 'paypal':
      return 'PayPal';
    case 'cash':
      return 'Espèces';
    case 'check':
      return 'Chèque';
    default:
      return 'Autre';
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'completed':
      return <Badge variant="success">Effectué</Badge>;
    case 'pending':
      return <Badge variant="outline">En attente</Badge>;
    case 'failed':
      return <Badge variant="destructive">Échoué</Badge>;
    case 'refunded':
      return <Badge variant="warning">Remboursé</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const PaymentsPage: React.FC = () => {
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>(mockPayments);

  // Logique de filtrage des paiements
  React.useEffect(() => {
    let filtered = mockPayments;
    
    // Filtrer par statut
    if (activeTab !== 'all') {
      filtered = filtered.filter(payment => payment.status === activeTab);
    }
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(payment => 
        payment.invoiceId.toLowerCase().includes(term) ||
        payment.transactionId?.toLowerCase().includes(term) ||
        payment.notes?.toLowerCase().includes(term)
      );
    }
    
    setFilteredPayments(filtered);
  }, [activeTab, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paiements</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <ChevronsUpDown className="mr-2 h-4 w-4" /> Rapprochement bancaire
          </Button>
          <Button onClick={() => setIsRecordDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Enregistrer un paiement
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 830,00 €</div>
            <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 200,00 €</div>
            <p className="text-xs text-muted-foreground mt-1">1 paiement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Échoués</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">980,00 €</div>
            <p className="text-xs text-muted-foreground mt-1">1 paiement</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Taux de réussite</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">80%</div>
            <p className="text-xs text-muted-foreground mt-1">Sur les 30 derniers jours</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center p-4 border-b">
            <TabsList>
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="completed">Effectués</TabsTrigger>
              <TabsTrigger value="pending">En attente</TabsTrigger>
              <TabsTrigger value="failed">Échoués</TabsTrigger>
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
                    <TableHead>Date</TableHead>
                    <TableHead>Facture</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>ID transaction</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Aucun paiement trouvé
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-medium">{payment.invoiceId}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {getPaymentMethodIcon(payment.method)}
                            {getPaymentMethodName(payment.method)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {payment.transactionId || '-'}
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
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
      
      {/* Dialogue d'enregistrement de paiement */}
      <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invoice">Facture</Label>
              <Select>
                <SelectTrigger id="invoice">
                  <SelectValue placeholder="Sélectionner une facture" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inv1">FACT-2023-0001 - Entreprise ABC</SelectItem>
                  <SelectItem value="inv2">FACT-2023-0002 - Société XYZ</SelectItem>
                  <SelectItem value="inv3">FACT-2023-0003 - Boutique 123</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <Input id="amount" type="number" min="0" step="0.01" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="method">Méthode de paiement</Label>
              <Select>
                <SelectTrigger id="method">
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                  <SelectItem value="stripe">Carte bancaire (Stripe)</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="check">Chèque</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transactionId">ID de transaction (optionnel)</Label>
              <Input id="transactionId" placeholder="Ex: ch_123456789" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optionnel)</Label>
              <Input id="notes" placeholder="Notes additionnelles" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => setIsRecordDialogOpen(false)}>
              <Check className="mr-2 h-4 w-4" /> Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentsPage;
