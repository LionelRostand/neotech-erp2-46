
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Payment } from '../types/accounting-types';
import { Textarea } from "@/components/ui/textarea";
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface PaymentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: Payment | null;
  mode: 'create' | 'edit';
  onSuccess: () => void;
}

type FormValues = {
  invoiceId: string;
  amount: number;
  date: string;
  method: string;
  status: string;
  transactionId: string;
  currency: string;
  notes: string;
};

const PaymentFormDialog: React.FC<PaymentFormDialogProps> = ({
  open,
  onOpenChange,
  payment,
  mode,
  onSuccess
}) => {
  const paymentsCollection = useFirestore(COLLECTIONS.ACCOUNTING.PAYMENTS);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      invoiceId: '',
      amount: 0,
      date: new Date().toISOString().substring(0, 10),
      method: 'bank_transfer',
      status: 'pending',
      transactionId: '',
      currency: 'EUR',
      notes: '',
    }
  });

  useEffect(() => {
    if (payment && mode === 'edit') {
      form.reset({
        invoiceId: payment.invoiceId || '',
        amount: payment.amount || 0,
        date: payment.date || new Date().toISOString().substring(0, 10),
        method: payment.method || 'bank_transfer',
        status: payment.status || 'pending',
        transactionId: payment.transactionId || '',
        currency: payment.currency || 'EUR',
        notes: payment.notes || '',
      });
    } else {
      form.reset({
        invoiceId: '',
        amount: 0,
        date: new Date().toISOString().substring(0, 10),
        method: 'bank_transfer',
        status: 'pending',
        transactionId: '',
        currency: 'EUR',
        notes: '',
      });
    }
  }, [payment, mode, form]);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    try {
      const paymentData = {
        ...data,
        amount: Number(data.amount),
        updatedAt: new Date(),
      };

      if (mode === 'create') {
        paymentData.createdAt = new Date();
        paymentData.createdBy = 'current-user'; // Normally this would come from auth context

        await paymentsCollection.addDoc(paymentData);
        toast.success('Paiement ajouté avec succès');
      } else if (mode === 'edit' && payment?.id) {
        await paymentsCollection.updateDoc(payment.id, paymentData);
        toast.success('Paiement mis à jour avec succès');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du paiement:', error);
      toast.error(`Erreur lors de la ${mode === 'create' ? 'création' : 'mise à jour'} du paiement`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Ajouter un paiement' : 'Modifier le paiement'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="invoiceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de facture</FormLabel>
                  <FormControl>
                    <Input placeholder="FACT-2023-0001" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="0.00" 
                        {...field} 
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une devise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD (C$)</SelectItem>
                        <SelectItem value="CHF">CHF (Fr)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Méthode de paiement</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une méthode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                        <SelectItem value="stripe">Carte de crédit</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="cash">Espèces</SelectItem>
                        <SelectItem value="check">Chèque</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="completed">Validé</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="failed">Échoué</SelectItem>
                        <SelectItem value="refunded">Remboursé</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ID de transaction (optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: ch_123456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notes additionnelles" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Chargement...' : mode === 'create' ? 'Ajouter' : 'Mettre à jour'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentFormDialog;
