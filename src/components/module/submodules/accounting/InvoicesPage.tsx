
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter } from "lucide-react";
import RecentInvoicesTable from './components/RecentInvoicesTable';
import InvoiceViewDialog from './components/InvoiceViewDialog';
import { Invoice } from './types/accounting-types';
import { useInvoicesData } from './hooks/useInvoicesData';
import { Skeleton } from "@/components/ui/skeleton";

const InvoicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Récupération des données depuis Firestore
  const { invoices, isLoading } = useInvoicesData();

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  // Filtrer les factures selon leur statut
  const draftInvoices = invoices.filter(inv => inv.status === 'draft');
  const paidInvoices = invoices.filter(inv => inv.status === 'paid');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Factures</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouvelle Facture
        </Button>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="recent">Récentes</TabsTrigger>
            <TabsTrigger value="drafts">Brouillons</TabsTrigger>
            <TabsTrigger value="paid">Payées</TabsTrigger>
            <TabsTrigger value="overdue">En retard</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" /> Filtrer
          </Button>
        </div>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Factures récentes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <RecentInvoicesTable 
                  invoices={invoices}
                  onViewInvoice={handleViewInvoice}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Brouillons de factures</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <RecentInvoicesTable 
                  invoices={draftInvoices}
                  onViewInvoice={handleViewInvoice}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle>Factures payées</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <RecentInvoicesTable 
                  invoices={paidInvoices}
                  onViewInvoice={handleViewInvoice}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Factures en retard</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <RecentInvoicesTable 
                  invoices={overdueInvoices}
                  onViewInvoice={handleViewInvoice}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <InvoiceViewDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen} 
        invoice={selectedInvoice} 
      />
    </div>
  );
};

export default InvoicesPage;
