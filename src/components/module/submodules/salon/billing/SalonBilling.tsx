
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePenLine, Receipt, Wallet, CreditCard, Download, Eye, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import InvoicesList from './components/InvoicesList';
import PaymentsList from './components/PaymentsList';
import CreateInvoiceDialog from './components/CreateInvoiceDialog';
import RecordPaymentDialog from './components/RecordPaymentDialog';
import { useSalonBilling } from './hooks/useSalonBilling';

const SalonBilling = () => {
  const [activeTab, setActiveTab] = useState<string>("invoices");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState<boolean>(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState<boolean>(false);
  
  const { summaryData, selectedInvoiceId, setSelectedInvoiceId } = useSalonBilling();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Facturation</h2>
        <div className="flex gap-2">
          {activeTab === "invoices" ? (
            <Button onClick={() => setIsCreateInvoiceOpen(true)}>
              <FilePenLine className="mr-2 h-4 w-4" /> Créer une facture
            </Button>
          ) : (
            <Button onClick={() => setIsRecordPaymentOpen(true)}>
              <CreditCard className="mr-2 h-4 w-4" /> Enregistrer un paiement
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total facturé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
            <p className="text-xs text-muted-foreground mt-1">Ce mois-ci</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.paid.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
            <p className="text-xs text-muted-foreground mt-1">{Math.round((summaryData.paid / summaryData.total) * 100) || 0}% du total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{summaryData.pending.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
            <p className="text-xs text-muted-foreground mt-1">{summaryData.pendingInvoices} factures</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En retard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summaryData.overdue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
            <p className="text-xs text-muted-foreground mt-1">{summaryData.overdueInvoices} factures</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center p-4 border-b">
            <TabsList>
              <TabsTrigger value="invoices">Factures</TabsTrigger>
              <TabsTrigger value="payments">Paiements</TabsTrigger>
              <TabsTrigger value="reports">Rapports</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  className="pl-8 w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Exporter
              </Button>
            </div>
          </div>

          <TabsContent value="invoices" className="m-0">
            <InvoicesList 
              searchTerm={searchTerm} 
              onViewInvoice={setSelectedInvoiceId}
            />
          </TabsContent>
          
          <TabsContent value="payments" className="m-0">
            <PaymentsList searchTerm={searchTerm} />
          </TabsContent>
          
          <TabsContent value="reports" className="m-0">
            <div className="p-6 text-center text-muted-foreground">
              <Receipt className="mx-auto h-12 w-12 mb-2 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-1">Rapports financiers</h3>
              <p className="max-w-md mx-auto mb-4">
                Accédez aux rapports de ventes, tendances financières et analyses de chiffre d'affaires.
              </p>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" /> Voir les rapports
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <CreateInvoiceDialog 
        open={isCreateInvoiceOpen} 
        onOpenChange={setIsCreateInvoiceOpen} 
      />

      <RecordPaymentDialog 
        open={isRecordPaymentOpen} 
        onOpenChange={setIsRecordPaymentOpen}
        invoiceId={selectedInvoiceId} 
      />
    </div>
  );
};

export default SalonBilling;
