import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useFreightInvoices } from '@/hooks/modules/useFreightInvoices';
import FreightInvoicesDashboard from './FreightInvoicesDashboard';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { toast } from 'sonner';

const FreightInvoicesPage = () => {
  const { invoices, isLoading } = useFreightInvoices();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateInvoice = () => {
    // TODO: Implement invoice creation logic
    toast.info('Fonctionnalité de création de facture à implémenter');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Button onClick={handleCreateInvoice}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      {/* Tableau de bord des factures */}
      <FreightInvoicesDashboard invoices={invoices} isLoading={isLoading} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">Chargement...</TableCell>
            </TableRow>
          ) : (
            invoices.map(invoice => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.id}</TableCell>
              <TableCell>{invoice.clientName}</TableCell>
              <TableCell>{invoice.amount} €</TableCell>
              <TableCell>{invoice.status}</TableCell>
            </TableRow>
          ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FreightInvoicesPage;
