
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import { generateDocuments } from '../utils/documentGenerator';

interface InvoicePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: FreightInvoice | null;
  onSuccess?: (invoiceId: string, data: any) => void;
}

export function InvoicePaymentDialog({
  open,
  onOpenChange,
  invoice,
  onSuccess,
}: InvoicePaymentDialogProps) {
  const [formData, setFormData] = useState({
    paymentMethod: 'card',
    paymentReference: '',
  });

  if (!invoice) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // Ensure value is never an empty string
    const safeValue = value || 'card';
    setFormData((prev) => ({
      ...prev,
      [name]: safeValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const paymentData = {
        paymentMethod: formData.paymentMethod || 'card',
        paymentReference: formData.paymentReference,
        paidAt: new Date().toISOString(),
        status: 'paid',
      };

      await generateDocuments(invoice, paymentData);
      
      if (onSuccess && invoice.id) {
        await onSuccess(invoice.id, paymentData);
      }
      
      toast.success('Paiement enregistré avec succès');
      onOpenChange(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(`Erreur lors du traitement du paiement: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Facture</Label>
                <div className="p-2 border rounded bg-gray-50">
                  {invoice.invoiceNumber || 'N/A'}
                </div>
              </div>
              <div>
                <Label>Montant</Label>
                <div className="p-2 border rounded bg-gray-50">
                  {invoice.amount?.toLocaleString('fr-FR')} {invoice.currency || 'EUR'}
                </div>
              </div>
            </div>

            <div>
              <Label>Client</Label>
              <div className="p-2 border rounded bg-gray-50">{invoice.clientName || 'N/A'}</div>
            </div>

            <div>
              <Label htmlFor="paymentMethod">Méthode de paiement</Label>
              <Select
                value={formData.paymentMethod || 'card'}
                onValueChange={(value) => handleSelectChange('paymentMethod', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="transfer">Virement</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paymentReference">Référence du paiement</Label>
              <Input
                id="paymentReference"
                name="paymentReference"
                value={formData.paymentReference}
                onChange={handleChange}
                placeholder="Numéro de transaction, chèque, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer le paiement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
