
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { CreditCard, Banknote, Wallet, ArrowRight } from 'lucide-react';
import { useFreightInvoices, FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import { generateDocuments } from '../utils/documentGenerator';

interface InvoicePaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: FreightInvoice | null;
}

export const InvoicePaymentDialog = ({ open, onOpenChange, invoice }: InvoicePaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = React.useState<string>('card');
  const { refetchInvoices } = useFreightInvoices();

  if (!invoice) return null;

  const handlePaymentSubmit = async () => {
    try {
      // Update invoice status to 'paid'
      const invoiceRef = doc(db, COLLECTIONS.FREIGHT.BILLING, invoice.id);
      const paymentData = {
        status: 'paid',
        paidAt: new Date().toISOString(),
        paymentMethod: paymentMethod,
        paymentReference: `PAY-${Date.now()}`,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(invoiceRef, paymentData);
      
      // Generate invoice and delivery note documents
      try {
        await generateDocuments(invoice, paymentData);
        toast.success('Documents générés avec succès');
      } catch (error) {
        console.error('Error generating documents:', error);
        toast.error('Erreur lors de la génération des documents');
      }
      
      // Refresh invoice list
      await refetchInvoices();
      
      toast.success('Paiement enregistré avec succès');
      onOpenChange(false);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Erreur lors du traitement du paiement');
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="h-4 w-4 mr-2" />;
      case 'cash':
        return <Banknote className="h-4 w-4 mr-2" />;
      case 'transfer':
        return <ArrowRight className="h-4 w-4 mr-2" />;
      case 'paypal':
        return <Wallet className="h-4 w-4 mr-2" />;
      default:
        return <CreditCard className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Traiter le paiement</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4 text-sm text-muted-foreground">
            <p>Facture #{invoice.invoiceNumber || invoice.id.substring(0, 8)}</p>
            <p>Client: {invoice.clientName}</p>
            <p className="font-medium text-foreground mt-1">Montant: {invoice.amount.toLocaleString('fr-FR')} €</p>
          </div>
          
          <div className="space-y-4">
            <Label>Méthode de paiement</Label>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  {getPaymentIcon('card')}
                  Carte bancaire
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted">
                <RadioGroupItem value="transfer" id="transfer" />
                <Label htmlFor="transfer" className="flex items-center cursor-pointer">
                  {getPaymentIcon('transfer')}
                  Virement
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                  {getPaymentIcon('paypal')}
                  PayPal
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md cursor-pointer hover:bg-muted">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center cursor-pointer">
                  {getPaymentIcon('cash')}
                  Espèces
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="button" onClick={handlePaymentSubmit}>
            Confirmer le paiement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
