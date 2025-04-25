
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGarageData } from '@/hooks/garage/useGarageData';
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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Textarea } from "@/components/ui/textarea";

const appointmentFormSchema = z.object({
  clientId: z.string().min(1, "Veuillez sélectionner un client"),
  vehicleId: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
  time: z.string().min(1, "L'heure est requise"),
  type: z.string().min(1, "Le type de rendez-vous est requis"),
  notes: z.string().optional(),
});

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients?: any[];
  vehicles?: any[];
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({
  open,
  onOpenChange,
  clients: providedClients,
  vehicles: providedVehicles
}) => {
  const { clients = [], vehicles = [] } = useGarageData();
  
  const displayClients = providedClients || clients;
  const displayVehicles = providedVehicles || vehicles;
  
  const form = useForm<z.infer<typeof appointmentFormSchema>>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      notes: "",
    }
  });

  const watchedClientId = form.watch("clientId");
  const clientVehicles = watchedClientId 
    ? displayVehicles.filter(v => v.clientId === watchedClientId) 
    : [];

  const onSubmit = async (data: z.infer<typeof appointmentFormSchema>) => {
    try {
      const selectedClient = displayClients.find(c => c.id === data.clientId);
      if (!selectedClient) {
        toast.error("Client non trouvé");
        return;
      }

      const selectedVehicle = data.vehicleId 
        ? displayVehicles.find(v => v.id === data.vehicleId)
        : null;

      const appointmentData = {
        ...data,
        clientName: selectedClient.name || `${selectedClient.firstName} ${selectedClient.lastName}`,
        vehicleMake: selectedVehicle?.make || '',
        vehicleModel: selectedVehicle?.model || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, COLLECTIONS.GARAGE.APPOINTMENTS), appointmentData);
      toast.success("Rendez-vous créé avec succès");
      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error("Erreur lors de la création du rendez-vous");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouveau rendez-vous</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {displayClients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name || `${client.firstName || ''} ${client.lastName || ''}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {watchedClientId && clientVehicles.length > 0 && (
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Véhicule</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ''}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un véhicule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.make} {vehicle.model} {vehicle.licensePlate ? `(${vehicle.licensePlate})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

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

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heure</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de rendez-vous</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="reparation">Réparation</SelectItem>
                      <SelectItem value="diagnostic">Diagnostic</SelectItem>
                      <SelectItem value="revision">Révision</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Notes supplémentaires..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Créer le rendez-vous
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentDialog;
