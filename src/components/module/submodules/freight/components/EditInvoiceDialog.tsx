
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';

interface EditInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: FreightInvoice;
  onUpdate: (id: string, data: Partial<FreightInvoice>) => Promise<boolean>;
}

export const EditInvoiceDialog = ({
  open,
  onOpenChange,
  invoice,
  onUpdate
}: EditInvoiceDialogProps) => {
  const [formData, setFormData] = React.useState({
    clientName: invoice.clientName,
    amount: invoice.amount,
    invoiceNumber: invoice.invoiceNumber || '',
    containerNumber: invoice.containerNumber || '',
    shipmentReference: invoice.shipmentReference || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onUpdate(invoice.id, formData);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la facture</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="clientName">Client</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invoiceNumber">Numéro de facture</Label>
              <Input
                id="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="containerNumber">Numéro de conteneur</Label>
              <Input
                id="containerNumber"
                value={formData.containerNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, containerNumber: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="shipmentReference">Référence d'expédition</Label>
              <Input
                id="shipmentReference"
                value={formData.shipmentReference}
                onChange={(e) => setFormData(prev => ({ ...prev, shipmentReference: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Mettre à jour
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
