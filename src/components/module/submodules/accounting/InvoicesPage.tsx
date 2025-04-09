
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter } from "lucide-react";
import RecentInvoicesTable from './components/RecentInvoicesTable';
import InvoiceViewDialog from './components/InvoiceViewDialog';
import { Invoice } from './types/accounting-types';

// Exemple de données pour les factures
const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2023-001',
    clientName: 'Entreprise ABC',
    issueDate: '2023-01-15',
    dueDate: '2023-02-15',
    total: 1250.00,
    status: 'paid',
    currency: 'EUR',
    items: [
      { description: 'Service de consultation', quantity: 5, unitPrice: 200, taxRate: 20 },
      { description: 'Frais administratifs', quantity: 1, unitPrice: 50, taxRate: 20 }
    ],
    subtotal: 1050.00,
    taxAmount: 200.00,
    notes: 'Paiement reçu avec remerciements.',
    termsAndConditions: 'Paiement à 30 jours'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2023-002',
    clientName: 'Société XYZ',
    issueDate: '2023-01-20',
    dueDate: '2023-02-20',
    total: 850.00,
    status: 'pending',
    currency: 'EUR',
    items: [
      { description: 'Développement web', quantity: 10, unitPrice: 75, taxRate: 20 },
      { description: 'Hébergement annuel', quantity: 1, unitPrice: 100, taxRate: 0 }
    ],
    subtotal: 750.00,
    taxAmount: 100.00,
    notes: ''
  },
  {
    id: '3',
    invoiceNumber: 'INV-2023-003',
    clientName: 'Client Particulier',
    issueDate: '2023-02-01',
    dueDate: '2023-03-01',
    total: 450.00,
    status: 'overdue',
    currency: 'EUR',
    items: [
      { description: 'Audit de sécurité', quantity: 1, unitPrice: 300, taxRate: 20 },
      { description: 'Rapport détaillé', quantity: 1, unitPrice: 150, taxRate: 0 }
    ],
    subtotal: 450.00,
    taxAmount: 0.00
  }
];

const InvoicesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("recent");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

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
              <RecentInvoicesTable 
                invoices={mockInvoices}
                onViewInvoice={handleViewInvoice}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drafts">
          <Card>
            <CardHeader>
              <CardTitle>Brouillons de factures</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentInvoicesTable 
                invoices={mockInvoices.filter(inv => inv.status === 'draft')}
                onViewInvoice={handleViewInvoice}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle>Factures payées</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentInvoicesTable 
                invoices={mockInvoices.filter(inv => inv.status === 'paid')}
                onViewInvoice={handleViewInvoice}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>Factures en retard</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentInvoicesTable 
                invoices={mockInvoices.filter(inv => inv.status === 'overdue')}
                onViewInvoice={handleViewInvoice}
              />
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
