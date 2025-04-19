
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import StatCard from '@/components/StatCard';
import { invoices } from './invoicesData';
import { repairs } from '../repairs/repairsData';
import { clientsMap, vehiclesMap } from '../repairs/repairsData';
import CreateInvoiceDialog from './CreateInvoiceDialog';
import { Invoice } from '../types/garage-types';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const GarageInvoicesDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [invoicesData, setInvoicesData] = useState<Invoice[]>(invoices);
  
  const stats = {
    total: invoicesData.length,
    draft: invoicesData.filter(i => i.status === 'draft').length,
    unpaid: invoicesData.filter(i => i.status === 'sent' || i.status === 'overdue').length,
    paid: invoicesData.filter(i => i.status === 'paid').length,
  };

  const handleSaveInvoice = (invoice: Partial<Invoice>) => {
    const newInvoice = {
      ...invoice,
      id: `INV${Date.now().toString().substring(8)}`,
    } as Invoice;
    
    setInvoicesData([...invoicesData, newInvoice]);
    setShowAddDialog(false);
    toast.success('Facture créée avec succès');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Factures"
          value={stats.total.toString()}
          description="Toutes les factures"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          title="Brouillons"
          value={stats.draft.toString()}
          description="En attente d'envoi"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          title="Non payées"
          value={stats.unpaid.toString()}
          description="En attente de paiement"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatCard
          title="Payées"
          value={stats.paid.toString()}
          description="Ce mois-ci"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      <div className="bg-background rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Facture</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoicesData.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>{invoice.vehicleName}</TableCell>
                <TableCell>{invoice.total.toFixed(2)} €</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'}`}>
                    {invoice.status === 'paid' ? 'Payée' :
                     invoice.status === 'overdue' ? 'En retard' :
                     invoice.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateInvoiceDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleSaveInvoice}
        repairs={repairs}
        clientsMap={clientsMap}
        vehiclesMap={vehiclesMap}
      />
    </div>
  );
};

export default GarageInvoicesDashboard;
