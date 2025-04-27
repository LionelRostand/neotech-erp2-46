import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useGarageInvoices } from '@/hooks/garage/useGarageInvoices';
import { formatCurrency } from '@/lib/utils';
import { Plus, FileText, BadgeEuro, BadgeDollarSign } from 'lucide-react';
import ViewGarageInvoiceDialog from './ViewGarageInvoiceDialog';

const statusLabel = {
  paid: "Payée",
  pending: "En attente",
  overdue: "En retard",
  draft: "Brouillon",
  cancelled: "Annulée"
};

const GarageInvoicesDashboard = () => {
  const { invoices, isLoading, updateInvoice } = useGarageInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  
  const handleViewInvoice = (invoice: any) => {
    setSelectedInvoice(invoice);
  };

  const handlePaymentComplete = async () => {
    if (selectedInvoice) {
      await updateInvoice(selectedInvoice.id, {
        status: 'paid',
        paidAt: new Date().toISOString()
      });
    }
    setSelectedInvoice(null);
  };

  const totalInvoices = invoices?.length || 0;
  const totalPaid = invoices?.filter(inv => inv?.status === 'paid')?.reduce((sum, inv) => sum + (Number(inv?.amount) || 0), 0) || 0;
  const totalPending = invoices?.filter(inv => inv?.status === 'pending')?.reduce((sum, inv) => sum + (Number(inv?.amount) || 0), 0) || 0;
  const overdueCount = invoices?.filter(inv => {
    return inv?.status === 'overdue' || 
           (inv?.status === 'pending' && 
            inv?.dueDate && 
            typeof inv.dueDate === 'string' && 
            new Date(inv.dueDate) < new Date());
  })?.length || 0;

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle facture
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-blue-700" size={28} />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Factures</p>
                <p className="text-2xl font-bold">{totalInvoices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <BadgeEuro className="text-green-700" size={28} />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payées</p>
                <p className="text-xl font-bold">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <BadgeDollarSign className="text-yellow-700" size={28} />
              <div>
                <p className="text-sm font-medium text-muted-foreground">En attente</p>
                <p className="text-xl font-bold">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-red-700" size={28} />
              <div>
                <p className="text-sm font-medium text-muted-foreground">En retard</p>
                <p className="text-2xl font-bold">{overdueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h2 className="font-semibold mb-4 text-lg">Dernières factures</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N°</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices?.length ? (
                invoices.map(invoice => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.invoiceNumber || invoice.id}</TableCell>
                    <TableCell>{invoice.clientName}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell>{formatCurrency(Number(invoice.amount) || 0)}</TableCell>
                    <TableCell>{statusLabel[invoice.status] || invoice.status}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)}>
                        Voir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    Aucune facture trouvée
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedInvoice && (
        <ViewGarageInvoiceDialog
          invoice={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
};

export default GarageInvoicesDashboard;
