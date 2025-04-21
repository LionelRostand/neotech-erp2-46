
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  FileText 
} from 'lucide-react';
import { useInvoicesData } from '@/components/module/submodules/accounting/hooks/useInvoicesData';
import { InvoicesTable } from '@/components/module/submodules/accounting/components/InvoicesTable';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FreightAccountingPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { invoices, isLoading, error } = useInvoicesData(filterStatus !== 'all' ? filterStatus : undefined);

  const filteredInvoices = invoices.filter(invoice => 
    invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.containerReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.shipmentReference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewInvoice = (id: string) => {
    console.log('View invoice:', id);
  };

  const handleEditInvoice = (id: string) => {
    console.log('Edit invoice:', id);
  };

  const handleDeleteInvoice = (id: string) => {
    console.log('Delete invoice:', id);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <CreditCard className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">Comptabilité Freight</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="invoices">Factures</TabsTrigger>
          <TabsTrigger value="payments">Paiements</TabsTrigger>
          <TabsTrigger value="statements">Relevés</TabsTrigger>
          <TabsTrigger value="reports">Rapports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Factures</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="search"
                      placeholder="Rechercher..."
                      className="w-[300px] pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select 
                    value={filterStatus} 
                    onValueChange={setFilterStatus}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="draft">Brouillons</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="paid">Payées</SelectItem>
                      <SelectItem value="overdue">En retard</SelectItem>
                      <SelectItem value="cancelled">Annulées</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <InvoicesTable
                invoices={filteredInvoices}
                isLoading={isLoading}
                onView={handleViewInvoice}
                onEdit={handleEditInvoice}
                onDelete={handleDeleteInvoice}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Méthodes de Paiement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border rounded-lg p-4 flex flex-col items-center hover:bg-gray-50 cursor-pointer">
                  <CreditCard className="h-10 w-10 mb-2 text-blue-500" />
                  <span className="font-medium">Carte Bancaire</span>
                </div>
                <div className="border rounded-lg p-4 flex flex-col items-center hover:bg-gray-50 cursor-pointer">
                  <FileText className="h-10 w-10 mb-2 text-green-500" />
                  <span className="font-medium">Virement</span>
                </div>
                <div className="border rounded-lg p-4 flex flex-col items-center hover:bg-gray-50 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5a7 7 0 0 0-7 7v6h14v-6a7 7 0 0 0-7-7Z" />
                    <path d="M9.8 5.5a7 7 0 0 1 4.4 0" />
                    <path d="M9 9h6" />
                  </svg>
                  <span className="font-medium">PayPal</span>
                </div>
                <div className="border rounded-lg p-4 flex flex-col items-center hover:bg-gray-50 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M12 12h.01" />
                  </svg>
                  <span className="font-medium">Espèces</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements">
          <Card>
            <CardHeader>
              <CardTitle>Relevés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Générez et consultez vos relevés financiers.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Rapports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Consultez les rapports financiers.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FreightAccountingPage;
