
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, Plus, Receipt, User, Car, Calendar, FileCheck, 
  MoreHorizontal, Banknote, Download, Printer, FileText 
} from 'lucide-react';
import { toast } from 'sonner';
import CreateInvoiceDialog from './invoices/CreateInvoiceDialog';
import { repairs } from './repairs/repairsData';

// Types pour les factures
interface Invoice {
  id: string;
  clientId: string;
  vehicleId: string;
  repairId: string;
  date: string;
  dueDate: string;
  amount: number;
  tax: number;
  total: number;
  status: "paid" | "unpaid" | "draft" | "partial";
  paymentMethod?: string;
  notes: string;
  repairs: string[];
}

// Données fictives pour les factures
const invoicesData: Invoice[] = [
  {
    id: "FACT001",
    clientId: "CL002",
    vehicleId: "VH003",
    repairId: "RP003",
    date: "2023-10-19",
    dueDate: "2023-11-18",
    amount: 320.45,
    tax: 64.09,
    total: 384.54,
    status: "paid",
    paymentMethod: "Carte bancaire",
    notes: "Facture réglée le jour même.",
    repairs: ["RP003"]
  },
  {
    id: "FACT002",
    clientId: "CL004",
    vehicleId: "VH007",
    repairId: "RP002",
    date: "2023-10-17",
    dueDate: "2023-11-16",
    amount: 580.00,
    tax: 116.00,
    total: 696.00,
    status: "paid",
    paymentMethod: "Virement bancaire",
    notes: "Virement reçu le 18/10.",
    repairs: ["RP002"]
  },
  {
    id: "FACT003",
    clientId: "CL001",
    vehicleId: "VH002",
    repairId: "RP004",
    date: "2023-10-15",
    dueDate: "2023-11-14",
    amount: 145.30,
    tax: 29.06,
    total: 174.36,
    status: "unpaid",
    notes: "Rappel envoyé par email le 25/10.",
    repairs: ["RP004"]
  },
  {
    id: "FACT004",
    clientId: "CL005",
    vehicleId: "VH008",
    repairId: "RP005",
    date: "2023-10-14",
    dueDate: "2023-11-13",
    amount: 390.50,
    tax: 78.10,
    total: 468.60,
    status: "unpaid",
    notes: "",
    repairs: ["RP005"]
  },
  {
    id: "FACT005",
    clientId: "CL003",
    vehicleId: "VH005",
    repairId: "RP003",
    date: "2023-10-13",
    dueDate: "2023-11-12",
    amount: 950.75,
    tax: 190.15,
    total: 1140.90,
    status: "partial",
    paymentMethod: "Espèces",
    notes: "Acompte de 500€ reçu. Reste à payer: 640.90€",
    repairs: ["RP003"]
  }
];

// Mapping des clients et véhicules
const clientsMap = {
  CL001: "Jean Dupont",
  CL002: "Marie Lambert",
  CL003: "Pierre Martin",
  CL004: "Sophie Bernard",
  CL005: "Thomas Leclerc"
};

const vehiclesMap = {
  VH001: "Renault Clio",
  VH002: "Peugeot 308",
  VH003: "Citroen C3",
  VH004: "Ford Transit",
  VH005: "Mercedes Sprinter",
  VH007: "Volkswagen Golf",
  VH008: "Toyota Yaris"
};

// Fonction pour obtenir le badge en fonction du statut
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Payée</Badge>;
    case 'unpaid':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Non payée</Badge>;
    case 'partial':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Paiement partiel</Badge>;
    case 'draft':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Brouillon</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
  }
};

const GarageInvoices = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>(invoicesData);
  
  // Filtrer les factures en fonction de la recherche et du filtre
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      (clientsMap[invoice.clientId as keyof typeof clientsMap] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehiclesMap[invoice.vehicleId as keyof typeof vehiclesMap] || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && invoice.status === activeTab;
  });

  // Formater le montant en euros
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Gérer la création d'une nouvelle facture
  const handleCreateInvoice = (newInvoice: Omit<Invoice, 'id'>) => {
    const id = `FACT${String(invoices.length + 1).padStart(3, '0')}`;
    const invoice = { id, ...newInvoice };
    setInvoices(prev => [...prev, invoice as Invoice]);
    toast.success(`Facture ${id} créée avec succès`);
  };

  // Marquer une facture comme payée
  const handleMarkAsPaid = (id: string) => {
    setInvoices(prev => 
      prev.map(invoice => invoice.id === id ? { ...invoice, status: "paid", paymentMethod: "Carte bancaire" } : invoice)
    );
    toast.success(`Facture ${id} marquée comme payée`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Factures</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowCreateDialog(true)}
        >
          <Plus size={18} />
          <span>Nouvelle Facture</span>
        </Button>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recherche et filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Rechercher par client, véhicule, numéro..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs 
              defaultValue="all" 
              className="w-full md:w-auto"
              onValueChange={setActiveTab}
            >
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="unpaid">Non payées</TabsTrigger>
                <TabsTrigger value="paid">Payées</TabsTrigger>
                <TabsTrigger value="partial">Partielles</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Liste des factures */}
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
                  {filteredInvoices.map(invoice => (
                    <TableRow key={invoice.id} className="hover:bg-muted/50">
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
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{new Date(invoice.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(invoice.dueDate).toLocaleDateString('fr-FR')}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" title="Voir la facture">
                            <FileText className="h-4 w-4" />
                          </Button>
                          {invoice.status === 'unpaid' && (
                            <Button 
                              variant="outline" 
                              size="icon" 
                              title="Marquer comme payée"
                              onClick={() => handleMarkAsPaid(invoice.id)}
                            >
                              <Banknote className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="outline" size="icon" title="Télécharger">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" title="Imprimer">
                            <Printer className="h-4 w-4" />
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

      {/* Statistiques des factures */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Statistiques de facturation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Receipt className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Total des factures</h3>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(invoices.reduce((sum, invoice) => sum + invoice.total, 0))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {invoices.length} factures émises
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <FileCheck className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">Montant encaissé</h3>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(invoices
                  .filter(invoice => invoice.status === 'paid')
                  .reduce((sum, invoice) => sum + invoice.total, 0))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {invoices.filter(invoice => invoice.status === 'paid').length} factures payées
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Receipt className="h-5 w-5 text-red-600" />
                <h3 className="font-semibold">Montant à recevoir</h3>
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(invoices
                  .filter(invoice => invoice.status === 'unpaid')
                  .reduce((sum, invoice) => sum + invoice.total, 0))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {invoices.filter(invoice => invoice.status === 'unpaid').length} factures non payées
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateInvoiceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSave={handleCreateInvoice}
        clientsMap={clientsMap}
        vehiclesMap={vehiclesMap}
        repairs={repairs}
      />
    </div>
  );
};

export default GarageInvoices;
