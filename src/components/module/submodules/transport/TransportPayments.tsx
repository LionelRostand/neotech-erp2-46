import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  Filter, 
  Search, 
  Plus, 
  FileText, 
  Clock, 
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  AlertCircle,
  CreditCardIcon,
  Eye,
  Download,
  Mail,
  X,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import FiltersDialog from './payments/FiltersDialog';
import InvoiceDetailsDialog from './payments/InvoiceDetailsDialog';
import EmailInvoiceDialog from './payments/EmailInvoiceDialog';
import RecordPaymentDialog from './payments/RecordPaymentDialog';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { LineChart } from "@/components/ui/line-chart";

const mockInvoices = [
  { 
    id: 'inv1', 
    number: 'FACT-2023-001', 
    clientName: 'Alexandre Dupont', 
    vehicleInfo: 'Mercedes Classe E - AB-123-CD', 
    date: '2023-05-28', 
    amount: 450,
    status: 'paid',
    paymentMethod: 'card',
    dueDate: '2023-06-12'
  },
  { 
    id: 'inv2', 
    number: 'FACT-2023-002', 
    clientName: 'Marie Leroy', 
    vehicleInfo: 'BMW Série 5 - MN-012-OP', 
    date: '2023-05-29', 
    amount: 820,
    status: 'pending',
    paymentMethod: null,
    dueDate: '2023-06-13'
  },
  { 
    id: 'inv3', 
    number: 'FACT-2023-003', 
    clientName: 'Entreprise ABC', 
    vehicleInfo: 'Tesla Model S - EF-456-GH', 
    date: '2023-05-30', 
    amount: 1250,
    status: 'partially_paid',
    paymentMethod: 'transfer',
    dueDate: '2023-06-14'
  },
  { 
    id: 'inv4', 
    number: 'FACT-2023-004', 
    clientName: 'Jean Martin', 
    vehicleInfo: 'Renault Trafic - IJ-789-KL', 
    date: '2023-05-31', 
    amount: 650,
    status: 'overdue',
    paymentMethod: null,
    dueDate: '2023-06-07'
  }
];

const mockTransactions = [
  { 
    id: 'tx1', 
    invoiceNumber: 'FACT-2023-001', 
    clientName: 'Alexandre Dupont', 
    date: '2023-05-28', 
    amount: 450,
    method: 'card',
    status: 'successful',
    details: 'Visa ****4589'
  },
  { 
    id: 'tx2', 
    invoiceNumber: 'FACT-2023-003', 
    clientName: 'Entreprise ABC', 
    date: '2023-05-30', 
    amount: 800,
    method: 'transfer',
    status: 'successful',
    details: 'Virement bancaire'
  },
  { 
    id: 'tx3', 
    invoiceNumber: null, 
    clientName: 'Sophie Bernard', 
    date: '2023-05-31', 
    amount: 200,
    method: 'cash',
    status: 'successful',
    details: 'Acompte réservation'
  },
  { 
    id: 'tx4', 
    invoiceNumber: 'FACT-2023-005', 
    clientName: 'Pierre Moreau', 
    date: '2023-06-01', 
    amount: 350,
    method: 'paypal',
    status: 'failed',
    details: 'Transaction refusée'
  }
];

const mockPaymentMethods = [
  { id: 'card', name: 'Carte bancaire', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'transfer', name: 'Virement bancaire', icon: <ArrowUpDown className="h-4 w-4" /> },
  { id: 'cash', name: 'Espèces', icon: <CreditCardIcon className="h-4 w-4" /> },
  { id: 'paypal', name: 'PayPal', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'check', name: 'Chèque', icon: <FileText className="h-4 w-4" /> }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('fr-FR');
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-500">Payée</Badge>;
    case 'pending':
      return <Badge variant="outline">En attente</Badge>;
    case 'partially_paid':
      return <Badge className="bg-blue-500">Partiellement payée</Badge>;
    case 'overdue':
      return <Badge className="bg-red-500">En retard</Badge>;
    case 'cancelled':
      return <Badge variant="destructive">Annulée</Badge>;
    case 'successful':
      return <Badge className="bg-green-500">Réussie</Badge>;
    case 'failed':
      return <Badge variant="destructive">Échouée</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const getPaymentMethodIcon = (method: string | null) => {
  if (!method) return null;
  const paymentMethod = mockPaymentMethods.find(m => m.id === method);
  return paymentMethod ? paymentMethod.icon : null;
};

const getPaymentMethodName = (method: string | null) => {
  if (!method) return 'Non spécifié';
  const paymentMethod = mockPaymentMethods.find(m => m.id === method);
  return paymentMethod ? paymentMethod.name : method;
};

const TransportPayments = () => {
  const [activeTab, setActiveTab] = useState('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddPaymentDialog, setShowAddPaymentDialog] = useState(false);
  const [showInvoiceDialog, setShowInvoiceDialog] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  
  const [showFiltersDialog, setShowFiltersDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.vehicleInfo.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (Object.keys(appliedFilters).length === 0) return true;
    
    let matches = true;
    
    if (appliedFilters.dateFrom && new Date(invoice.date) < new Date(appliedFilters.dateFrom)) {
      matches = false;
    }
    
    if (appliedFilters.dateTo && new Date(invoice.date) > new Date(appliedFilters.dateTo)) {
      matches = false;
    }
    
    if (appliedFilters.amount && invoice.amount !== appliedFilters.amount) {
      matches = false;
    }
    
    if (appliedFilters.clientName && 
        !invoice.clientName.toLowerCase().includes(appliedFilters.clientName.toLowerCase())) {
      matches = false;
    }
    
    if (appliedFilters.paymentStatus && invoice.status !== appliedFilters.paymentStatus) {
      matches = false;
    }
    
    if (appliedFilters.paymentMethod && invoice.paymentMethod !== appliedFilters.paymentMethod) {
      matches = false;
    }
    
    return matches;
  });

  const filteredTransactions = mockTransactions.filter(tx => 
    (tx.invoiceNumber?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    tx.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getPaymentMethodName(tx.method).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRecordPayment = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowPaymentDialog(true);
  };

  const handleCreateInvoice = () => {
    toast.success("Facture créée avec succès");
    setShowInvoiceDialog(false);
  };

  const handleViewDetails = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowDetailsDialog(true);
  };

  const handleEmailInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
    setShowEmailDialog(true);
  };

  const handleDownloadPdf = (invoice: any) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('FACTURE', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Facture N° : ${invoice.number}`, 15, 40);
    doc.text(`Date : ${new Date(invoice.date).toLocaleDateString('fr-FR')}`, 15, 50);
    doc.text(`Échéance : ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}`, 15, 60);
    
    doc.text(`Client: ${invoice.clientName}`, 15, 80);
    doc.text(`Véhicule: ${invoice.vehicleInfo}`, 15, 90);
    
    const tableColumn = ["Description", "Prix"];
    const tableRows = [
      ["Service de transport", `${(invoice.amount * 0.8).toLocaleString('fr-FR')} €`],
      ["Frais additionnels", `${(invoice.amount * 0.2).toLocaleString('fr-FR')} €`],
    ];
    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 110,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 6 },
      headStyles: { fillColor: [22, 33, 62] }
    });
    
    doc.setFontSize(14);
    doc.text(`Total : ${invoice.amount.toLocaleString('fr-FR')} €`, 150, 150, { align: 'right' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Merci pour votre confiance', 105, 260, { align: 'center' });
    
    doc.save(`Facture_${invoice.number}.pdf`);
    
    toast.success("Facture téléchargée au format PDF");
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    toast.success("Filtres appliqués");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Gestion des Paiements</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <ChevronDown className="mr-2 h-4 w-4" /> Rapprochement bancaire
          </Button>
          <Button onClick={() => setShowInvoiceDialog(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Créer une facture
          </Button>
          <Button onClick={() => setShowAddPaymentDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Enregistrer un paiement
          </Button>
        </div>
      </div>
      
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher une facture ou un paiement..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => setShowFiltersDialog(true)}
        >
          <Filter className="h-4 w-4" />
          Filtres
          {Object.keys(appliedFilters).length > 0 && (
            <Badge className="ml-1 bg-primary h-5 w-5 p-0 flex items-center justify-center rounded-full">
              {Object.keys(appliedFilters).filter(key => appliedFilters[key]).length}
            </Badge>
          )}
        </Button>
      </div>
      
      <Collapsible defaultOpen={true} className="border rounded-md">
        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-medium">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-muted-foreground" />
            <span>Statistiques des paiements</span>
          </div>
          <ChevronDown className="h-4 w-4 transition-transform ui-open:rotate-180" />
        </CollapsibleTrigger>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Factures</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Transactions</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="invoices" className="mt-4 space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Suivi de paiement</AlertTitle>
              <AlertDescription>
                2 factures en attente de paiement, 1 facture en retard nécessitant un rappel.
              </AlertDescription>
            </Alert>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Liste des factures</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numéro</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Véhicule</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Échéance</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                          Aucune facture trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.number}</TableCell>
                          <TableCell>{invoice.clientName}</TableCell>
                          <TableCell>{invoice.vehicleInfo}</TableCell>
                          <TableCell>{formatDate(invoice.date)}</TableCell>
                          <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                          <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleViewDetails(invoice)}
                                title="Voir détails"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleEmailInvoice(invoice)}
                                title="Envoyer par email"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDownloadPdf(invoice)}
                                title="Télécharger PDF"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewDetails(invoice)}>
                                    <Eye className="h-4 w-4 mr-2" /> Voir détails
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleEmailInvoice(invoice)}>
                                    <Mail className="h-4 w-4 mr-2" /> Envoyer par email
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDownloadPdf(invoice)}>
                                    <Download className="h-4 w-4 mr-2" /> Télécharger PDF
                                  </DropdownMenuItem>
                                  {invoice.status !== 'paid' && (
                                    <DropdownMenuItem onClick={() => handleRecordPayment(invoice)}>
                                      <CreditCard className="h-4 w-4 mr-2" /> Enregistrer un paiement
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="transactions" className="mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Historique des transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Facture</TableHead>
                      <TableHead>Méthode</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Détails</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                          Aucune transaction trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>{formatDate(tx.date)}</TableCell>
                          <TableCell>{tx.clientName}</TableCell>
                          <TableCell>{tx.invoiceNumber || '-'}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPaymentMethodIcon(tx.method)}
                              <span>{getPaymentMethodName(tx.method)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(tx.amount)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{tx.details}</TableCell>
                          <TableCell>{getStatusBadge(tx.status)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Collapsible>
      
      <Dialog open={showAddPaymentDialog} onOpenChange={setShowAddPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enregistrer un paiement</DialogTitle>
            <DialogDescription>
              Saisissez les informations du paiement à enregistrer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="invoice">Facture</Label>
              <Select value={selectedInvoiceId} onValueChange={setSelectedInvoiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une facture" />
                </SelectTrigger>
                <SelectContent>
                  {mockInvoices.map(invoice => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.number} - {invoice.clientName} ({formatCurrency(invoice.amount)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="method">Méthode de paiement</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  {mockPaymentMethods.map(method => (
                    <SelectItem key={method.id} value={method.id}>
                      <div className="flex items-center gap-2">
                        {method.icon}
                        <span>{method.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddPaymentDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleRecordPayment}>Enregistrer le paiement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showInvoiceDialog} onOpenChange={setShowInvoiceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Créer une facture</DialogTitle>
            <DialogDescription>
              Saisissez les informations pour créer une nouvelle facture.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">Alexandre Dupont</SelectItem>
                  <SelectItem value="client2">Marie Leroy</SelectItem>
                  <SelectItem value="client3">Entreprise ABC</SelectItem>
                  <SelectItem value="client4">Jean Martin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="service1">Location de véhicule</SelectItem>
                  <SelectItem value="service2">Transport avec chauffeur</SelectItem>
                  <SelectItem value="service3">Service aéroport</SelectItem>
                  <SelectItem value="service4">Événement spécial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <Input id="amount" type="number" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input id="dueDate" type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInvoiceDialog(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateInvoice}>Créer la facture</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <FiltersDialog 
        open={showFiltersDialog} 
        onOpenChange={setShowFiltersDialog}
        onApplyFilters={handleApplyFilters}
      />
      
      <InvoiceDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        invoice={selectedInvoice}
      />
      
      <EmailInvoiceDialog
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        invoice={selectedInvoice}
      />
      
      <RecordPaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        invoice={selectedInvoice}
      />
    </div>
  );
};

export default TransportPayments;
