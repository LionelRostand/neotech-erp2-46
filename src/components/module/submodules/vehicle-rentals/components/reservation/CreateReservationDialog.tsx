
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/create-operations';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Client, Vehicle } from '../../types/rental-types';

const reservationSchema = z.object({
  clientId: z.string().min(1, "Le client est requis"),
  vehicleId: z.string().min(1, "Le véhicule est requis"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().min(1, "La date de fin est requise"),
});

interface CreateReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateReservationDialog: React.FC<CreateReservationDialogProps> = ({
  open,
  onOpenChange
}) => {
  const form = useForm<z.infer<typeof reservationSchema>>({
    resolver: zodResolver(reservationSchema),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['rentals', 'clients'],
    queryFn: () => fetchCollectionData<Client>(COLLECTIONS.TRANSPORT.CLIENTS)
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ['rentals', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.TRANSPORT.VEHICLES)
  });

  const onSubmit = async (values: z.infer<typeof reservationSchema>) => {
    try {
      const client = clients.find(c => c.id === values.clientId);
      const vehicle = vehicles.find(v => v.id === values.vehicleId);
      
      if (!client || !vehicle) {
        toast.error("Client ou véhicule introuvable");
        return;
      }

      const reservationData = {
        ...values,
        clientName: `${client.firstName} ${client.lastName}`,
        status: 'pending' as const,
        totalAmount: 0, // À calculer selon votre logique métier
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addDocument(COLLECTIONS.TRANSPORT.RESERVATIONS, reservationData);
      toast.success("Réservation créée avec succès");
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast.error("Erreur lors de la création de la réservation");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle Réservation</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.firstName} {client.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Véhicule</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un véhicule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de début</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de fin</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Créer la réservation
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReservationDialog;
