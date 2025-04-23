
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Client, Vehicle } from '../types/rental-types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from "@/components/ui/button";

interface Reservation {
  id: string;
  clientId: string;
  vehicleId: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface CreateInvoiceFormData {
  reservationId: string;
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
  const form = useForm<CreateInvoiceFormData>({
    defaultValues: {
      reservationId: 'no-selection', // Use a non-empty default value
    }
  });
  
  const { data: reservations = [] } = useQuery({
    queryKey: ['rentals', 'reservations'],
    queryFn: () => fetchCollectionData<Reservation>(COLLECTIONS.TRANSPORT.RESERVATIONS)
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['rentals', 'clients'],
    queryFn: () => fetchCollectionData<Client>(COLLECTIONS.TRANSPORT.CLIENTS)
  });
  
  const { data: vehicles = [] } = useQuery({
    queryKey: ['rentals', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.TRANSPORT.VEHICLES)
  });

  const onSubmit = async (data: CreateInvoiceFormData) => {
    try {
      // Prevent empty reservationId
      if (!data.reservationId || data.reservationId === 'no-selection') {
        toast.error('Veuillez sélectionner une réservation');
        return;
      }

      const reservation = reservations.find(r => r.id === data.reservationId);
      if (!reservation) {
        toast.error('Réservation non trouvée');
        return;
      }

      const client = clients.find(c => c.id === reservation.clientId);
      if (!client) {
        toast.error('Client non trouvé');
        return;
      }

      const invoice = {
        ...data,
        clientId: reservation.clientId,
        clientName: `${client.firstName} ${client.lastName}`,
        clientEmail: client.email,
        vehicleId: reservation.vehicleId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
        status: 'pending' as const,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, COLLECTIONS.TRANSPORT.INVOICES), invoice);
      
      toast.success('Facture créée avec succès');
      onOpenChange(false);
      form.reset({
        reservationId: 'no-selection', // Reset to non-empty default
        amount: 0,
        notes: ''
      });
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };

  const getReservationLabel = (reservation: Reservation) => {
    const client = clients.find(c => c.id === reservation.clientId);
    const vehicle = vehicles.find(v => v.id === reservation.vehicleId);
    return `${client?.firstName || 'Client'} ${client?.lastName || ''} - ${vehicle?.name || 'Véhicule'} (${reservation.startDate} au ${reservation.endDate})`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle Facture de Location</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="reservationId">Réservation</label>
            <select {...form.register('reservationId')} className="w-full border rounded p-2">
              <option value="no-selection">Sélectionner une réservation</option>
              {reservations
                .filter(res => res.status !== 'cancelled')
                .map((reservation) => (
                  <option key={reservation.id} value={reservation.id}>
                    {getReservationLabel(reservation)}
                  </option>
              ))}
            </select>
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
