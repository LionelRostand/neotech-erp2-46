
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, Plus, User, Car, Calendar, Download, Printer, 
  Send, Clock, CreditCard, CheckCircle, AlertTriangle, MoreHorizontal 
} from 'lucide-react';
import { Invoice } from './types/garage-types';

// Sample data for invoices
const sampleInvoices: Invoice[] = [
  {
    id: "INV-2023-056",
    clientId: "CL001",
    vehicleId: "VH001",
    repairs: ["RP004"], // Added repairs array
    repairId: "RP004",
    date: "2023-10-11",
    dueDate: "2023-10-25",
    amount: 145.30,
    tax: 29.06,
    total: 174.36,
    status: 'paid',
    paymentMethod: 'card',
    notes: "Vidange + contrôle niveaux"
  },
  {
    id: "INV-2023-057",
    clientId: "CL005",
    vehicleId: "VH008",
    repairs: ["RP005"], // Added repairs array
    repairId: "RP005",
    date: "2023-10-14",
    dueDate: "2023-10-28",
    amount: 390.50,
    tax: 78.10,
    total: 468.60,
    status: 'paid',
    paymentMethod: 'cash',
    notes: "Remplacement plaquettes et disques de frein"
  },
  {
    id: "INV-2023-058",
    clientId: "CL002",
    vehicleId: "VH003",
    repairs: ["RP001"], // Added repairs array
    repairId: "RP001",
    date: "2023-10-20",
    dueDate: "2023-11-03",
    amount: 320.45,
    tax: 64.09,
    total: 384.54,
    status: 'unpaid',
    notes: "Diagnostic système démarrage + réparation"
  },
  {
    id: "INV-2023-059",
    clientId: "CL004",
    vehicleId: "VH007",
    repairs: ["RP002"], // Added repairs array
    repairId: "RP002",
    date: "2023-10-17",
    dueDate: "2023-10-31",
    amount: 580.00,
    tax: 116.00,
    total: 696.00,
    status: 'unpaid',
    notes: "Remplacement système d'embrayage"
  },
  {
    id: "INV-2023-060",
    clientId: "CL003",
    vehicleId: "VH005",
    repairs: ["RP003"], // Added repairs array
    repairId: "RP003",
    date: "2023-10-19",
    dueDate: "2023-11-02",
    amount: 950.75,
    tax: 190.15,
    total: 1140.90,
    status: 'partial',
    paymentMethod: 'transfer',
    notes: "Remplacement injecteurs diesel - Acompte reçu 500€"
  }
];

const clientsMap = {
  CL001: "Jean Dupont",
  CL002: "Marie Lambert",
  CL003: "Pierre Martin",
  CL004: "Sophie Bernard",
  CL005: "Thomas Leclerc"
};

const vehiclesMap = {
  VH001: "Renault Clio - AB-123-CD",
  VH003: "Citroen C3 - IJ-789-KL",
  VH005: "Mercedes Sprinter - QR-345-ST",
  VH007: "Volkswagen Golf - UV-678-WX",
  VH008: "Toyota Yaris - YZ-901-AB"
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Payée</Badge>;
    case 'unpaid':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Non payée</Badge>;
    case 'partial':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Partiellement payée</Badge>;
    case 'cancelled':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Annulée</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
  }
};

const GarageInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(sampleInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceDialogOpen, setIsInvoiceDialogOpen] = useState(false);

  // Filter invoices based on search term
  const filteredInvoices = invoices.filter(invoice => 
    invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (clientsMap[invoice.clientId as keyof typeof clientsMap] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vehiclesMap[invoice.vehicleId as keyof typeof vehiclesMap] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle invoice selection for detail view
  const handleInvoiceSelect = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Factures</h2>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          <span>Nouvelle Facture</span>
        </Button>
      </div>

      {/* Invoice search and filter */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recherche et filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par numéro, client, véhicule..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs defaultValue="all" className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="paid">Payées</TabsTrigger>
                <TabsTrigger value="unpaid">Non payées</TabsTrigger>
                <TabsTrigger value="overdue">En retard</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Invoices list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Liste des factures</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucune facture trouvée. Créez une nouvelle facture avec le bouton "Nouvelle Facture".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>N° Facture</TableHead>
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
                  {filteredInvoices.map(invoice => (
                    <TableRow key={invoice.id} onClick={() => handleInvoiceSelect(invoice)} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{clientsMap[invoice.clientId as keyof typeof clientsMap]}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Car className="h-4 w-4 text-muted-foreground" />
                          <span>{vehiclesMap[invoice.vehicleId as keyof typeof vehiclesMap]}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="font-medium">
                        {invoice.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                      </TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" title="Télécharger">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="Envoyer">
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="Plus d'options">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invoice stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total facturé (mois)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 864,40 €</div>
            <p className="text-xs text-muted-foreground mt-1">+12% par rapport au mois précédent</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Factures payées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">642,96 €</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>2 factures</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 080,54 €</div>
            <div className="flex items-center text-xs text-amber-600 mt-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>2 factures</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Factures en retard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 140,90 €</div>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>1 facture</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice detail dialog */}
      {selectedInvoice && (
        <Dialog open={isInvoiceDialogOpen} onOpenChange={setIsInvoiceDialogOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Détails de la facture</DialogTitle>
            </DialogHeader>
            
            <div className="bg-muted/50 rounded-lg p-6 mt-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold">Facture {selectedInvoice.id}</h3>
                  <p className="text-muted-foreground">
                    Émise le {new Date(selectedInvoice.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-right">
                  {getStatusBadge(selectedInvoice.status)}
                  {selectedInvoice.status === 'paid' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Payé par {selectedInvoice.paymentMethod === 'card' ? 'carte bancaire' : 
                                selectedInvoice.paymentMethod === 'cash' ? 'espèces' : 
                                selectedInvoice.paymentMethod === 'transfer' ? 'virement' : 'autre'}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Client</h4>
                  <p className="font-semibold">{clientsMap[selectedInvoice.clientId as keyof typeof clientsMap]}</p>
                  <p className="text-sm">ID Client: {selectedInvoice.clientId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Véhicule</h4>
                  <p className="font-semibold">{vehiclesMap[selectedInvoice.vehicleId as keyof typeof vehiclesMap]}</p>
                  <p className="text-sm">ID Véhicule: {selectedInvoice.vehicleId}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                <p>{selectedInvoice.notes}</p>
              </div>
              
              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Montant HT</span>
                  <span>{selectedInvoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-muted-foreground">TVA (20%)</span>
                  <span>{selectedInvoice.tax.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                <div className="flex justify-between mt-4 text-lg font-bold">
                  <span>Total TTC</span>
                  <span>{selectedInvoice.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row md:justify-between gap-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>À payer avant le {new Date(selectedInvoice.dueDate).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex space-x-2">
                  {selectedInvoice.status !== 'paid' && (
                    <Button className="flex items-center gap-2" size="sm" variant="default">
                      <CreditCard className="h-4 w-4" />
                      <span>Enregistrer paiement</span>
                    </Button>
                  )}
                  <Button className="flex items-center gap-2" size="sm" variant="outline">
                    <Send className="h-4 w-4" />
                    <span>Envoyer</span>
                  </Button>
                  <Button className="flex items-center gap-2" size="sm" variant="outline">
                    <Printer className="h-4 w-4" />
                    <span>Imprimer</span>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default GarageInvoices;
