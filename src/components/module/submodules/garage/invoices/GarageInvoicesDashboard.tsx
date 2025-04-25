
import React from 'react';
import { useGarageInvoices } from '@/hooks/garage/useGarageInvoices';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Receipt } from "lucide-react";
import StatCard from '@/components/StatCard';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';
import EditInvoiceDialog from './EditInvoiceDialog';
import DeleteInvoiceDialog from './DeleteInvoiceDialog';
import ViewInvoiceDialog from './ViewInvoiceDialog';

const GarageInvoicesDashboard = () => {
  const { invoices, isLoading } = useGarageInvoices();
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);
  const [showViewDialog, setShowViewDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const todayInvoices = invoices.filter(inv => {
    const today = new Date().toISOString().split('T')[0];
    return inv.date.startsWith(today);
  });

  const pendingInvoices = invoices.filter(inv => inv.status === 'unpaid');
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

  const stats = {
    today: todayInvoices.length,
    pending: pendingInvoices.length,
    overdue: overdueInvoices.length,
    total: invoices.length
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Button onClick={() => toast.info('Fonctionnalité en développement')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Factures aujourd'hui"
          value={stats.today.toString()}
          icon={<FileText className="h-4 w-4 text-blue-500" />}
          description="Factures du jour"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="En attente"
          value={stats.pending.toString()}
          icon={<Receipt className="h-4 w-4 text-amber-500" />}
          description="Factures en attente"
          className="bg-amber-50 hover:bg-amber-100"
        />
        <StatCard
          title="En retard"
          value={stats.overdue.toString()}
          icon={<Receipt className="h-4 w-4 text-red-500" />}
          description="Factures en retard"
          className="bg-red-50 hover:bg-red-100"
        />
        <StatCard
          title="Total factures"
          value={stats.total.toString()}
          icon={<Receipt className="h-4 w-4 text-emerald-500" />}
          description="Toutes les factures"
          className="bg-emerald-50 hover:bg-emerald-100"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dernières factures</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
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
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowViewDialog(true);
                      }}>
                        Voir
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowEditDialog(true);
                      }}>
                        Modifier
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowDeleteDialog(true);
                      }}>
                        Supprimer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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
        onUpdate={async (id, data) => {
          try {
            await updateInvoice(id, data);
            toast.success('Facture mise à jour avec succès');
            setShowEditDialog(false);
            setSelectedInvoice(null);
          } catch (error) {
            toast.error('Erreur lors de la mise à jour de la facture');
          }
        }}
      />

      <DeleteInvoiceDialog
        invoice={selectedInvoice}
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedInvoice(null);
        }}
        onDelete={async (id) => {
          try {
            await deleteInvoice(id);
            toast.success('Facture supprimée avec succès');
            setShowDeleteDialog(false);
            setSelectedInvoice(null);
          } catch (error) {
            toast.error('Erreur lors de la suppression de la facture');
          }
        }}
      />
    </div>
  );
};

export default GarageInvoicesDashboard;
