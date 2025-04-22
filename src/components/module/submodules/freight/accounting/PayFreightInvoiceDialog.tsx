
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
import { CreditCard, Wallet, BanknoteIcon, QrCode } from 'lucide-react';
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
  const [loading, setLoading] = useState<boolean>(false);

  const handlePaymentMethodChange = (value: string) => {
    setPaymentMethod(value);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit({
        method: paymentMethod,
        reference,
        notes,
        amount: invoice.amount,
        date: new Date().toISOString(),
        invoiceId: invoice.id,
        clientName: invoice.clientName,
        shipmentReference: invoice.shipmentReference,
        containerNumber: invoice.containerNumber
      });
      setLoading(false);
    } catch (error) {
      console.error('Error submitting payment:', error);
      setLoading(false);
    }
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
                <p className="text-xl font-bold">{formatCurrency(invoice.amount, invoice.currency || 'EUR')}</p>
              </div>
            </div>

            {(invoice.shipmentReference || invoice.containerNumber) && (
              <div className="mt-2 text-sm text-gray-500">
                {invoice.shipmentReference && <p>Expédition: {invoice.shipmentReference}</p>}
                {invoice.containerNumber && <p>Conteneur: {invoice.containerNumber}</p>}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="paymentMethod">Méthode de paiement</Label>
            <div className="grid grid-cols-4 gap-2 mt-2">
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
              <Button
                type="button"
                variant={paymentMethod === 'cash' ? 'default' : 'outline'}
                className="flex flex-col items-center justify-center h-20 px-2"
                onClick={() => handlePaymentMethodChange('cash')}
              >
                <BanknoteIcon className="h-8 w-8 mb-1" />
                <span className="text-xs">Espèces</span>
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
                paymentMethod === 'transfer' ? 'Référence du virement' :
                'Référence du paiement'
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

          <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
            <div className="flex items-start">
              <QrCode className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-700">Information</p>
                <p className="text-xs text-blue-600">
                  Un QR code sera généré sur la facture et le bon de livraison pour permettre le suivi de votre expédition et de vos conteneurs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Traitement...' : 'Confirmer le paiement'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
