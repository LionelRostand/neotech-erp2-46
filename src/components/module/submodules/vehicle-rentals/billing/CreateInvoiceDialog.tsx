import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Vehicle } from '../types/rental-types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";

interface CreateInvoiceFormData {
  clientName: string;
  clientEmail: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  amount: number;
  notes?: string;
}

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const form = useForm<CreateInvoiceFormData>();
  
  const { data: vehicles = [] } = useQuery({
    queryKey: ['rentals', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.TRANSPORT.VEHICLES)
  });

  const onSubmit = async (data: CreateInvoiceFormData) => {
    try {
      // Add invoice to Firestore
      const invoice = {
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Add to Firestore collection
      await addDoc(collection(db, COLLECTIONS.TRANSPORT.INVOICES), invoice);
      
      toast.success('Facture créée avec succès');
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle Facture de Location</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="clientName">Nom du client</label>
            <input {...form.register('clientName')} className="w-full border rounded p-2" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="clientEmail">Email du client</label>
            <input {...form.register('clientEmail')} type="email" className="w-full border rounded p-2" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="vehicleId">Véhicule</label>
            <select {...form.register('vehicleId')} className="w-full border rounded p-2">
              {vehicles.map((vehicle) => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.name} - {vehicle.licensePlate}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate">Date de début</label>
              <input {...form.register('startDate')} type="date" className="w-full border rounded p-2" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="endDate">Date de fin</label>
              <input {...form.register('endDate')} type="date" className="w-full border rounded p-2" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="amount">Montant</label>
            <input {...form.register('amount')} type="number" step="0.01" className="w-full border rounded p-2" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="notes">Notes</label>
            <textarea {...form.register('notes')} className="w-full border rounded p-2" rows={3} />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
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

export default CreateInvoiceDialog;
