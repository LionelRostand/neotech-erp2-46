import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Receipt, Smartphone, Gift, ArrowRightLeft, Save } from "lucide-react";
import { useSalonBilling } from '../hooks/useSalonBilling';
import { PaymentMethod } from '../../types/salon-types';
import { toast } from 'sonner';

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceId?: string | null;
}

const RecordPaymentDialog: React.FC<RecordPaymentDialogProps> = ({ 
  open, 
  onOpenChange,
  invoiceId 
}) => {
  const { invoices, recordPayment } = useSalonBilling();
  
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: 0,
    method: 'credit_card' as PaymentMethod,
    date: new Date().toISOString().split('T')[0],
    reference: '',
    notes: ''
  });
  
  const selectedInvoice = invoiceId 
    ? invoices.find(invoice => invoice.id === invoiceId) 
    : null;
  
  const getRemainingAmount = () => {
    if (!selectedInvoice) return 0;
    
    const totalPaid = selectedInvoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    return Math.max(0, selectedInvoice.total - totalPaid);
  };
  
  useEffect(() => {
    if (open) {
      setFormData({
        invoiceId: invoiceId || '',
        amount: getRemainingAmount(),
        method: 'credit_card',
        date: new Date().toISOString().split('T')[0],
        reference: '',
        notes: ''
      });
    }
  }, [open, invoiceId]);
  
  const handleSubmit = async () => {
    try {
      if (!formData.invoiceId) {
        toast.error('Veuillez sélectionner une facture');
        return;
      }
      
      if (formData.amount <= 0) {
        toast.error('Le montant doit être supérieur à zéro');
        return;
      }
      
      await recordPayment({
        ...formData,
        status: 'completed'
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Erreur lors de l\'enregistrement du paiement');
    }
  };
  
  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'credit_card':
        return <CreditCard className="h-4 w-4 mr-2" />;
      case 'cash':
        return <Receipt className="h-4 w-4 mr-2" />;
      case 'mobile_payment':
        return <Smartphone className="h-4 w-4 mr-2" />;
      case 'gift_card':
        return <Gift className="h-4 w-4 mr-2" />;
      case 'transfer':
        return <ArrowRightLeft className="h-4 w-4 mr-2" />;
      default:
        return <CreditCard className="h-4 w-4 mr-2" />;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invoice">Facture</Label>
            {invoiceId ? (
              <div className="flex items-center border rounded-md p-2">
                <span className="font-medium">{selectedInvoice?.number}</span>
                <span className="mx-2">-</span>
                <span>{selectedInvoice?.clientName}</span>
                <span className="ml-auto font-bold">
                  {selectedInvoice?.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </span>
              </div>
            ) : (
              <Select 
                value={formData.invoiceId}
                onValueChange={(value) => setFormData({ ...formData, invoiceId: value })}
              >
                <SelectTrigger id="invoice">
                  <SelectValue placeholder="Sélectionner une facture" />
                </SelectTrigger>
                <SelectContent>
                  {invoices
                    .filter(invoice => invoice.status !== 'paid')
                    .map((invoice) => (
                      <SelectItem key={invoice.id} value={invoice.id}>
                        {invoice.number} - {invoice.clientName} 
                        ({invoice.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              type="number"
              min={0}
              step={0.01}
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
            />
            {selectedInvoice && (
              <p className="text-sm text-muted-foreground">
                Reste à payer: {getRemainingAmount().toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="method">Méthode de paiement</Label>
            <Select 
              value={formData.method}
              onValueChange={(value) => setFormData({ 
                ...formData, 
                method: value as PaymentMethod 
              })}
            >
              <SelectTrigger id="method" className="w-full">
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="credit_card" className="flex items-center">
                  <div className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    <span>Carte bancaire</span>
                  </div>
                </SelectItem>
                <SelectItem value="cash">
                  <div className="flex items-center">
                    <Receipt className="h-4 w-4 mr-2" />
                    <span>Espèces</span>
                  </div>
                </SelectItem>
                <SelectItem value="mobile_payment">
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2" />
                    <span>Paiement mobile</span>
                  </div>
                </SelectItem>
                <SelectItem value="gift_card">
                  <div className="flex items-center">
                    <Gift className="h-4 w-4 mr-2" />
                    <span>Carte cadeau</span>
                  </div>
                </SelectItem>
                <SelectItem value="transfer">
                  <div className="flex items-center">
                    <ArrowRightLeft className="h-4 w-4 mr-2" />
                    <span>Virement</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reference">Référence (optionnel)</Label>
            <Input
              id="reference"
              placeholder="Numéro de transaction, référence chèque..."
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea
              id="notes"
              placeholder="Notes sur le paiement"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" /> Enregistrer le paiement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordPaymentDialog;
