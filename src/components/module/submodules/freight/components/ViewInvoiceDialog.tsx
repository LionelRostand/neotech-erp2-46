
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';

interface ViewInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: FreightInvoice;
}

export const ViewInvoiceDialog = ({
  open,
  onOpenChange,
  invoice
}: ViewInvoiceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la facture</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">N° Facture:</span>
            <span className="col-span-2">{invoice.invoiceNumber || '-'}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Client:</span>
            <span className="col-span-2">{invoice.clientName}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Montant:</span>
            <span className="col-span-2">{invoice.amount.toLocaleString('fr-FR')} €</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Statut:</span>
            <span className="col-span-2">{invoice.status}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">N° Conteneur:</span>
            <span className="col-span-2">{invoice.containerNumber || '-'}</span>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Réf. Expédition:</span>
            <span className="col-span-2">{invoice.shipmentReference || '-'}</span>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
