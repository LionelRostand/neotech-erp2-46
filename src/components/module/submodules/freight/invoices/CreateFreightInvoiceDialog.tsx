
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useForm } from 'react-hook-form';

interface CreateFreightInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateFreightInvoiceDialog = ({ open, onOpenChange }: CreateFreightInvoiceDialogProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      clientName: '',
      amount: '',
      invoiceNumber: '',
      containerNumber: '',
      shipmentReference: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const invoiceData = {
        clientName: data.clientName,
        amount: parseFloat(data.amount),
        invoiceNumber: data.invoiceNumber,
        containerNumber: data.containerNumber || null,
        shipmentReference: data.shipmentReference || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currency: 'EUR'
      };

      const invoicesCollection = collection(db, COLLECTIONS.FREIGHT.BILLING);
      await addDoc(invoicesCollection, invoiceData);
      
      toast.success('Facture créée avec succès');
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName">Client *</Label>
              <Input 
                id="clientName" 
                {...register('clientName', { required: 'Le client est requis' })} 
                placeholder="Nom du client"
              />
              {errors.clientName && <p className="text-red-500 text-sm">{errors.clientName.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Montant * (€)</Label>
              <Input 
                id="amount" 
                type="number" 
                step="0.01" 
                {...register('amount', { required: 'Le montant est requis' })} 
                placeholder="0.00"
              />
              {errors.amount && <p className="text-red-500 text-sm">{errors.amount.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Numéro de facture</Label>
            <Input 
              id="invoiceNumber" 
              {...register('invoiceNumber')} 
              placeholder="FRE-001"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="containerNumber">Numéro de conteneur</Label>
              <Input 
                id="containerNumber" 
                {...register('containerNumber')} 
                placeholder="CONT-1234"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shipmentReference">Référence d'expédition</Label>
              <Input 
                id="shipmentReference" 
                {...register('shipmentReference')} 
                placeholder="SHIP-1234"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Annuler
            </Button>
            <Button type="submit">Créer la facture</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
