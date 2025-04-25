
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Invoice } from '../../types/garage-types';

interface ViewInvoiceDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewInvoiceDialog = ({ invoice, isOpen, onClose }: ViewInvoiceDialogProps) => {
  if (!invoice) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la facture</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Facture N°:</span>
            <span className="col-span-2">{invoice.id}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Client:</span>
            <span className="col-span-2">{invoice.clientName}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Date:</span>
            <span className="col-span-2">{new Date(invoice.date).toLocaleDateString()}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Échéance:</span>
            <span className="col-span-2">{new Date(invoice.dueDate).toLocaleDateString()}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Montant HT:</span>
            <span className="col-span-2">{invoice.amount.toFixed(2)} €</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">TVA:</span>
            <span className="col-span-2">{invoice.tax.toFixed(2)} €</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Total TTC:</span>
            <span className="col-span-2 font-bold">{invoice.total.toFixed(2)} €</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Statut:</span>
            <span className="col-span-2">
              {invoice.status === 'paid' ? 'Payée' :
               invoice.status === 'unpaid' ? 'Non payée' :
               invoice.status === 'overdue' ? 'En retard' : 'Annulée'}
            </span>
          </div>
          
          {invoice.notes && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Notes:</span>
              <span className="col-span-2">{invoice.notes}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInvoiceDialog;
