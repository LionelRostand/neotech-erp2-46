
import React, { useState } from "react";
import { Calendar, DollarSign, Download, Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useFreightData } from "@/hooks/modules/useFreightData";
import FreightAccountingSummaryDialog from "./FreightAccountingSummaryDialog";

const statusColorMap: Record<string, string> = {
  paid: "text-green-600 bg-green-100",
  pending: "text-amber-600 bg-amber-100",
  overdue: "text-red-600 bg-red-100",
  draft: "text-slate-600 bg-slate-100"
};

const FreightAccountingPage: React.FC = () => {
  const { shipments, clients, containers, loading } = useFreightData();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("invoices");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [summaryDialogOpen, setSummaryDialogOpen] = useState(false);

  const invoices = shipments.map(shipment => {
    const client = clients.find(c => c.id === shipment.customer) || { id: "", name: "Unknown" };
    return {
      id: shipment.id,
      reference: shipment.reference,
      clientName: client.name,
      clientId: client.id,
      date: shipment.scheduledDate,
      amount: shipment.totalPrice || 0,
      status: shipment.status === "delivered" ? "paid" : 
             shipment.status === "confirmed" ? "pending" : 
             shipment.status === "delayed" ? "overdue" : "draft"
    };
  });

  // Filter based on search, status, and date
  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter;
    
    // Simplified date filter (could be expanded with actual date ranges)
    const matchesDate = dateFilter === "all"; // For now, always true
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalRevenue = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const paidInvoices = filteredInvoices.filter(inv => inv.status === "paid");
  const paidRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const pendingRevenue = filteredInvoices
    .filter(inv => inv.status === "pending")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Comptabilité</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setSummaryDialogOpen(true)}>
            <DollarSign className="mr-2 h-4 w-4" />
            Récapitulatif
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Chiffre d'affaires total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.length} factures • {new Date().toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Revenus encaissés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {paidRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {paidInvoices.length} factures • {Math.round((paidRevenue / totalRevenue) * 100 || 0)}% du total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paiements en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {pendingRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredInvoices.filter(inv => inv.status === "pending").length} factures • En attente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters */}
      <Tabs defaultValue="invoices" value={currentTab} onValueChange={setCurrentTab}>
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <TabsList className="mb-2 md:mb-0">
            <TabsTrigger value="invoices">Factures</TabsTrigger>
            <TabsTrigger value="quotes">Devis</TabsTrigger>
            <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          </TabsList>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8 w-full sm:w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="overdue">En retard</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les périodes</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="week">Cette semaine</SelectItem>
                <SelectItem value="month">Ce mois</SelectItem>
                <SelectItem value="quarter">Ce trimestre</SelectItem>
                <SelectItem value="year">Cette année</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="invoices" className="mt-0">
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <p>Chargement des données...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Facture</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Aucune facture trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell>{invoice.reference}</TableCell>
                          <TableCell>{invoice.clientName}</TableCell>
                          <TableCell>
                            {invoice.date 
                              ? new Date(invoice.date).toLocaleDateString() 
                              : "-"}
                          </TableCell>
                          <TableCell>
                            {invoice.amount.toLocaleString('fr-FR', { 
                              style: 'currency', 
                              currency: 'EUR' 
                            })}
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${statusColorMap[invoice.status] || ""}`}>
                              {invoice.status === "paid" ? "Payé" : 
                               invoice.status === "pending" ? "En attente" : 
                               invoice.status === "overdue" ? "En retard" : "Brouillon"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">Voir</Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quotes">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Gestion des devis</h3>
              <p className="text-muted-foreground mb-4">Créez et gérez des devis pour vos clients</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouveau devis
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses">
          <Card>
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Suivi des dépenses</h3>
              <p className="text-muted-foreground mb-4">Enregistrez et suivez les dépenses liées au fret</p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle dépense
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <FreightAccountingSummaryDialog 
        open={summaryDialogOpen}
        onOpenChange={setSummaryDialogOpen}
        shipments={shipments}
        clients={clients}
        containers={containers}
      />
    </div>
  );
};

export default FreightAccountingPage;
