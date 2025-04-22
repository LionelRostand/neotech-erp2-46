
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, CashRegister, Bank as BankIcon, PaypalLogo } from "lucide-react";
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface PayFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: FreightInvoice;
  onSubmit: (paymentData: any) => Promise<void>;
}

export const PayFreightInvoiceDialog: React.FC<PayFreightInvoiceDialogProps> = ({
  open,
  onOpenChange,
  invoice,
  onSubmit
}) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const paymentMethods: PaymentMethod[] = [
    { id: "card", name: "Carte bancaire", icon: <CreditCard className="h-4 w-4" /> },
    { id: "paypal", name: "PayPal", icon: <PaypalLogo className="h-4 w-4" /> },
    { id: "transfer", name: "Virement bancaire", icon: <Bank className="h-4 w-4" /> },
    { id: "cash", name: "Espèces", icon: <CashRegister className="h-4 w-4" /> }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const paymentData = {
        method: paymentMethod,
        reference: paymentReference,
        date: new Date().toISOString(),
        amount: invoice.amount,
        currency: invoice.currency || "EUR",
        notes
      };
      
      await onSubmit(paymentData);
      // The dialog will be closed by the parent component after onSubmit
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Erreur lors du traitement du paiement");
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Paiement de facture</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2 mb-4">
              <Label htmlFor="invoice-details">Détails de la facture</Label>
              <div className="p-3 bg-slate-50 rounded-md text-sm">
                <div className="flex justify-between mb-1">
                  <span>Client:</span>
                  <span className="font-medium">{invoice.clientName}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Montant:</span>
                  <span className="font-medium">{invoice.amount.toFixed(2)} {invoice.currency || "EUR"}</span>
                </div>
                {invoice.invoiceNumber && (
                  <div className="flex justify-between mb-1">
                    <span>Facture N°:</span>
                    <span className="font-medium">{invoice.invoiceNumber}</span>
                  </div>
                )}
                {invoice.shipmentReference && (
                  <div className="flex justify-between mb-1">
                    <span>Expédition:</span>
                    <span className="font-medium">{invoice.shipmentReference}</span>
                  </div>
                )}
                {invoice.containerNumber && (
                  <div className="flex justify-between mb-1">
                    <span>Conteneur:</span>
                    <span className="font-medium">{invoice.containerNumber}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="payment-method" className="mb-2 block">Méthode de paiement</Label>
              <RadioGroup 
                id="payment-method" 
                value={paymentMethod} 
                onValueChange={setPaymentMethod}
                className="grid grid-cols-2 gap-4"
              >
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={method.id} id={`payment-${method.id}`} />
                    <Label 
                      htmlFor={`payment-${method.id}`}
                      className="flex items-center cursor-pointer"
                    >
                      {method.icon}
                      <span className="ml-2">{method.name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="reference">Référence de paiement</Label>
              <Input
                id="reference"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                placeholder={
                  paymentMethod === "card" ? "4 derniers chiffres de la carte" :
                  paymentMethod === "paypal" ? "Email PayPal ou ID de transaction" :
                  paymentMethod === "transfer" ? "Référence du virement" :
                  "Reçu caisse N°"
                }
              />
            </div>
            
            <div>
              <Label htmlFor="notes">Notes additionnelles</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Informations complémentaires sur le paiement..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Traitement..." : "Confirmer le paiement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PayFreightInvoiceDialog;
