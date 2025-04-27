
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';

interface CreateFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateFreightInvoiceDialog: React.FC<CreateFreightInvoiceDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const form = useForm<Partial<FreightInvoice>>({
    defaultValues: {
      status: 'pending',
      currency: 'EUR'
    }
  });
  
  const onSubmit = async (data: Partial<FreightInvoice>) => {
    try {
      const newInvoice = {
        ...data,
        createdAt: new Date().toISOString(),
        status: data.status || 'pending'
      };
      
      await addDocument(COLLECTIONS.FREIGHT.BILLING, newInvoice);
      
      toast.success('Facture créée avec succès');
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle Facture de Transport</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="clientName">Nom du Client</label>
            <input {...form.register('clientName')} className="w-full border rounded p-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="amount">Montant</label>
              <input 
                type="number" 
                step="0.01" 
                {...form.register('amount', { setValueAs: (v) => parseFloat(v) })} 
                className="w-full border rounded p-2" 
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="currency">Devise</label>
              <select {...form.register('currency')} className="w-full border rounded p-2">
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="shipmentReference">Référence d'Expédition</label>
            <input {...form.register('shipmentReference')} className="w-full border rounded p-2" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status">Statut</label>
            <select {...form.register('status')} className="w-full border rounded p-2">
              <option value="pending">En attente</option>
              <option value="paid">Payée</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer la facture
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFreightInvoiceDialog;
