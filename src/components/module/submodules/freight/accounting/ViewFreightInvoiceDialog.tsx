
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from '@/components/module/submodules/accounting/utils/formatting';
import { Badge } from '@/components/ui/badge';

interface ViewFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
}

export const ViewFreightInvoiceDialog = ({ 
  open, 
  onOpenChange,
  invoice 
}: ViewFreightInvoiceDialogProps) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Payée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Non spécifiée';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la facture</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">N° Facture</h3>
              <p className="text-lg font-semibold">{invoice.invoiceNumber || 'FT-' + invoice.id}</p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-500">Statut</h3>
              <div className="mt-1">{getStatusBadge(invoice.status)}</div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Informations Client</h3>
            <p className="font-semibold">{invoice.clientName}</p>
          </div>

          <div className="border-t pt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Référence Conteneur</h3>
              <p>{invoice.containerReference || 'Non spécifié'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Référence Expédition</h3>
              <p>{invoice.shipmentReference || 'Non spécifié'}</p>
            </div>
          </div>

          <div className="border-t pt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Date d'émission</h3>
              <p>{formatDate(invoice.issueDate || invoice.date)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Date d'échéance</h3>
              <p>{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          {invoice.paymentMethod && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Informations de paiement</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Méthode</p>
                  <p>{invoice.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Date de paiement</p>
                  <p>{formatDate(invoice.paymentDate)}</p>
                </div>
              </div>
            </div>
          )}

          <div className="border-t pt-4 mt-4 text-right">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Montant total</h3>
            <p className="text-2xl font-bold">{formatCurrency(invoice.total, invoice.currency || 'EUR')}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
