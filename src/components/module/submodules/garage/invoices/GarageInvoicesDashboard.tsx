
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, Receipt } from "lucide-react";
import StatCard from '@/components/StatCard';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Invoice } from '../types/garage-types';
import CreateInvoiceDialog from './CreateInvoiceDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

const GarageInvoicesDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { invoices, repairs, clients, vehicles, isLoading } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i?.status === 'draft').length,
    unpaid: invoices.filter(i => ['sent', 'overdue'].includes(i?.status || '')).length,
    paid: invoices.filter(i => i?.status === 'paid').length,
  };

  const handleSaveInvoice = (invoice: Partial<Invoice>) => {
    toast.success('Facture créée avec succès');
    setShowAddDialog(false);
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
          title="Total factures"
          value={invoices.length.toString()}
          icon={<FileText className="h-4 w-4 text-blue-500" />}
          description="Toutes les factures"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="En attente"
          value={invoices.filter(i => i?.status === 'pending').length.toString()}
          icon={<Receipt className="h-4 w-4 text-amber-500" />}
          description="Factures non payées"
          className="bg-amber-50 hover:bg-amber-100"
        />
        <StatCard
          title="En retard"
          value={invoices.filter(i => i?.status === 'overdue').length.toString()}
          icon={<Receipt className="h-4 w-4 text-red-500" />}
          description="Paiements en retard"
          className="bg-red-50 hover:bg-red-100"
        />
        <StatCard
          title="Payées"
          value={invoices.filter(i => i?.status === 'paid').length.toString()}
          icon={<Receipt className="h-4 w-4 text-emerald-500" />}
          description="Factures réglées"
          className="bg-emerald-50 hover:bg-emerald-100"
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
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Aucune facture trouvée. Cliquez sur "Nouvelle facture" pour en ajouter.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice?.id}>
                  <TableCell>{invoice?.id || 'N/A'}</TableCell>
                  <TableCell>{invoice?.date ? new Date(invoice.date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>{invoice?.clientName || 'N/A'}</TableCell>
                  <TableCell>{invoice?.vehicleName || 'N/A'}</TableCell>
                  <TableCell>{invoice?.total !== undefined ? invoice.total.toFixed(2) : '0.00'} €</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${invoice?.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice?.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      invoice?.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'}`}>
                      {invoice?.status === 'paid' ? 'Payée' :
                       invoice?.status === 'overdue' ? 'En retard' :
                       invoice?.status === 'sent' ? 'Envoyée' : 'Brouillon'}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateInvoiceDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleSaveInvoice}
        repairs={repairs}
        clientsMap={Object.fromEntries(clients.map(c => [c?.id || '', `${c?.firstName || ''} ${c?.lastName || ''}`]))}
        vehiclesMap={Object.fromEntries(vehicles.map(v => [v?.id || '', `${v?.make || ''} ${v?.model || ''}`]))}
      />
    </div>
  );
};

export default GarageInvoicesDashboard;
