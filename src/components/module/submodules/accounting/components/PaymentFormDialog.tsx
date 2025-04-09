
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Payment } from '../types/accounting-types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface PaymentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: Payment | null;
  onSuccess: () => void;
}

const PaymentFormDialog: React.FC<PaymentFormDialogProps> = ({
  open,
  onOpenChange,
  payment,
  onSuccess
}) => {
  const isEditMode = !!payment;
  const paymentsCollection = useFirestore(COLLECTIONS.ACCOUNTING.PAYMENTS);
  
  const [formData, setFormData] = useState({
    amount: 0,
    invoiceId: '',
    date: new Date().toISOString().split('T')[0],
    method: 'bank_transfer',
    status: 'pending',
    transactionId: '',
    currency: 'EUR',
    notes: '',
  });

  useEffect(() => {
    if (payment) {
      setFormData({
        amount: payment.amount || 0,
        invoiceId: payment.invoiceId || '',
        date: payment.date || new Date().toISOString().split('T')[0],
        method: payment.method || 'bank_transfer',
        status: payment.status || 'pending',
        transactionId: payment.transactionId || '',
        currency: payment.currency || 'EUR',
        notes: payment.notes || '',
      });
    }
  }, [payment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const paymentData = {
        ...formData,
        updatedAt: new Date(),
      };
      
      if (!isEditMode) {
        // Add new properties for new payments
        const newPaymentData = {
          ...paymentData,
          createdAt: new Date(),
          createdBy: 'current-user',
        };
        
        await paymentsCollection.add(newPaymentData);
        toast.success('Paiement créé avec succès');
      } else if (payment?.id) {
        await paymentsCollection.update(payment.id, paymentData);
        toast.success('Paiement mis à jour avec succès');
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du paiement:', error);
      toast.error('Impossible d\'enregistrer le paiement');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Modifier le paiement' : 'Nouveau paiement'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <div className="flex">
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select 
                value={formData.currency} 
                onValueChange={(value) => handleSelectChange('currency', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                  <SelectItem value="JPY">JPY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoiceId">Numéro de facture</Label>
            <Input
              id="invoiceId"
              name="invoiceId"
              value={formData.invoiceId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date de paiement</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="method">Méthode de paiement</Label>
              <Select 
                value={formData.method} 
                onValueChange={(value) => handleSelectChange('method', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="check">Chèque</SelectItem>
                  <SelectItem value="stripe">Carte de crédit</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="completed">Validé</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                  <SelectItem value="refunded">Remboursé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transactionId">ID de transaction</Label>
              <Input
                id="transactionId"
                name="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentFormDialog;
