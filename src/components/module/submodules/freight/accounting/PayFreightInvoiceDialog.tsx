
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Wallet, BanknoteIcon } from 'lucide-react';
import { formatCurrency } from '@/components/module/submodules/accounting/utils/formatting';

interface PayFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: any;
  onSubmit: (data: any) => void;
}

export const PayFreightInvoiceDialog = ({ 
  open, 
  onOpenChange,
  invoice,
  onSubmit 
}: PayFreightInvoiceDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [reference, setReference] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleSubmit = () => {
    onSubmit({
      method: paymentMethod,
      reference,
      notes,
      amount: invoice.total,
      date: new Date().toISOString()
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) {
        setPaymentMethod('card');
        setReference('');
        setNotes('');
      }
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Effectuer un paiement</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="p-4 bg-gray-50 rounded-md mb-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Facture</p>
                <p className="font-semibold">{invoice.invoiceNumber || `n°${invoice.id}`}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Montant</p>
                <p className="text-xl font-bold">{formatCurrency(invoice.total, invoice.currency || 'EUR')}</p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="paymentMethod">Méthode de paiement</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button
                type="button"
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-20 px-2"
                onClick={() => handlePaymentMethodChange('card')}
              >
                <CreditCard className="h-8 w-8 mb-1" />
                <span className="text-xs">Carte bancaire</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-20 px-2"
                onClick={() => handlePaymentMethodChange('paypal')}
              >
                <Wallet className="h-8 w-8 mb-1" />
                <span className="text-xs">PayPal</span>
              </Button>
              <Button
                type="button"
                variant={paymentMethod === 'transfer' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-20 px-2"
                onClick={() => handlePaymentMethodChange('transfer')}
              >
                <BanknoteIcon className="h-8 w-8 mb-1" />
                <span className="text-xs">Virement</span>
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="reference">Référence du paiement</Label>
            <Input
              id="reference"
              value={reference}
              onChange={e => setReference(e.target.value)}
              placeholder={
                paymentMethod === 'card' ? 'Numéro d\'autorisation' :
                paymentMethod === 'paypal' ? 'Identifiant de transaction PayPal' :
                'Référence du virement'
              }
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Informations supplémentaires sur le paiement"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Confirmer le paiement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
