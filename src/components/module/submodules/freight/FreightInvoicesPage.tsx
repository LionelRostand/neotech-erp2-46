
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useFreightInvoices from '@/hooks/modules/useFreightInvoices';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import FreightInvoicesDashboard from './invoices/FreightInvoicesDashboard';
import CreateFreightInvoiceDialog from './invoices/CreateFreightInvoiceDialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { cn } from '@/lib/utils';

const FreightInvoicesPage = () => {
  const { invoices, isLoading, updateInvoice } = useFreightInvoices();
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const handleCreateInvoice = () => {
    setShowCreateDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      paid: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
      pending: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      cancelled: "bg-red-100 text-red-800 hover:bg-red-200",
    };

    const statusLabels = {
      paid: "Payée",
      pending: "En attente",
      cancelled: "Annulée"
    };

    return (
      <Badge className={cn(
        "font-medium",
        statusStyles[status as keyof typeof statusStyles] || "bg-gray-100 text-gray-800"
      )}>
        {statusLabels[status as keyof typeof statusLabels] || status}
      </Badge>
    );
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

      <FreightInvoicesDashboard invoices={invoices} isLoading={isLoading} />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">N° Facture</TableHead>
              <TableHead className="font-semibold">Client</TableHead>
              <TableHead className="font-semibold">Réf. Expédition</TableHead>
              <TableHead className="font-semibold">Réf. Conteneur</TableHead>
              <TableHead className="font-semibold">Montant</TableHead>
              <TableHead className="font-semibold">Coût conteneur</TableHead>
              <TableHead className="font-semibold">Statut</TableHead>
              <TableHead className="font-semibold">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="text-muted-foreground">Chargement des factures...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="text-muted-foreground">Aucune facture trouvée</div>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => (
                <TableRow key={invoice.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{invoice.invoiceNumber || invoice.id}</TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell>
                    {invoice.shipmentReference && (
                      <Badge variant="outline" className="bg-blue-50">
                        {invoice.shipmentReference}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {invoice.containerNumber && (
                      <Badge variant="outline" className="bg-purple-50">
                        {invoice.containerNumber}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {invoice.amount?.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: invoice.currency || 'EUR'
                    })}
                  </TableCell>
                  <TableCell className="font-medium">
                    {invoice.containerCost?.toLocaleString('fr-FR', { 
                      style: 'currency', 
                      currency: invoice.currency || 'EUR'
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CreateFreightInvoiceDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default FreightInvoicesPage;
