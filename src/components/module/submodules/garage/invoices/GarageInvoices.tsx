import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil, Trash2, Receipt } from "lucide-react";
import StatCard from '@/components/StatCard';
import { useGarageInvoices } from '@/hooks/garage/useGarageInvoices';
import { Invoice } from '../types/garage-types';
import ViewInvoiceDialog from './ViewInvoiceDialog';
import EditInvoiceDialog from './EditInvoiceDialog';
import DeleteInvoiceDialog from './DeleteInvoiceDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import CreateInvoiceDialog from './CreateInvoiceDialog';
import { useGarageData } from '@/hooks/garage/useGarageData';

const GarageInvoices = () => {
  const { invoices, isLoading, updateInvoice, deleteInvoice } = useGarageInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { clients, vehicles, repairs } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const unpaidInvoices = invoices.filter(invoice => invoice.status === 'sent' || invoice.status === 'overdue');
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);

  const handleSaveInvoice = (invoice: Partial<Invoice>) => {
    // Cette fonction sera implémentée plus tard avec Firestore
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Factures"
          value={invoices.length.toString()}
          icon={<Receipt className="h-4 w-4" />}
          description="Toutes les factures"
        />
        <StatCard
          title="Factures Impayées"
          value={unpaidInvoices.length.toString()}
          icon={<Receipt className="h-4 w-4" />}
          description="En attente de paiement"
        />
        <StatCard
          title="Montant Total"
          value={`${totalAmount.toLocaleString()}€`}
          icon={<Receipt className="h-4 w-4" />}
          description="Chiffre d'affaires"
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
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>{invoice.vehicleName}</TableCell>
                <TableCell>{invoice.total.toLocaleString()} €</TableCell>
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
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowViewDialog(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowEditDialog(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ViewInvoiceDialog
        invoice={selectedInvoice}
        isOpen={showViewDialog}
        onClose={() => {
          setShowViewDialog(false);
          setSelectedInvoice(null);
        }}
      />

      <EditInvoiceDialog
        invoice={selectedInvoice}
        isOpen={showEditDialog}
        onClose={() => {
          setShowEditDialog(false);
          setSelectedInvoice(null);
        }}
        onUpdate={updateInvoice}
      />

      <DeleteInvoiceDialog
        invoice={selectedInvoice}
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedInvoice(null);
        }}
        onDelete={deleteInvoice}
      />

      <CreateInvoiceDialog 
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSave={handleSaveInvoice}
        repairs={repairs}
        clientsMap={Object.fromEntries(clients.map(c => [c.id, c.firstName + ' ' + c.lastName]))}
        vehiclesMap={Object.fromEntries(vehicles.map(v => [v.id, `${v.make} ${v.model}`]))}
      />
    </div>
  );
};

export default GarageInvoices;
