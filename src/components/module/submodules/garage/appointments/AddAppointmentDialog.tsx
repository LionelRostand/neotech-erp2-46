
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient, Vehicle } from '../types/garage-types';

// Define the form schema
const appointmentSchema = z.object({
  clientId: z.string().min(1, { message: "Le client est requis" }),
  vehicleId: z.string().min(1, { message: "Le véhicule est requis" }),
  date: z.string().min(1, { message: "La date est requise" }),
  time: z.string().min(1, { message: "L'heure est requise" }),
  type: z.string().min(1, { message: "Le type de rendez-vous est requis" }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AddAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: GarageClient[];
  vehicles: Vehicle[];
}

const AddAppointmentDialog: React.FC<AddAppointmentDialogProps> = ({ 
  open, 
  onOpenChange,
  clients = [],
  vehicles = []
}) => {
  const { add } = useFirestore(COLLECTIONS.GARAGE.APPOINTMENTS);

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      clientId: '',
      vehicleId: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      type: 'maintenance',
      notes: '',
    },
  });

  const clientId = form.watch('clientId');
  
  // Filter vehicles by the selected client
  const clientVehicles = clientId 
    ? vehicles.filter(vehicle => vehicle.clientId === clientId)
    : [];

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      const selectedClient = clients.find(c => c.id === data.clientId);
      const selectedVehicle = vehicles.find(v => v.id === data.vehicleId);
      
      if (!selectedClient || !selectedVehicle) {
        toast.error("Client ou véhicule non trouvé");
        return;
      }

      const appointment = {
        ...data,
        clientName: `${selectedClient.firstName} ${selectedClient.lastName}`,
        vehicleMake: selectedVehicle.make,
        vehicleModel: selectedVehicle.model,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      await add(appointment);
      toast.success("Rendez-vous créé avec succès");
      
      // Reset the form
      form.reset();
      
      // Close the dialog
      if (typeof onOpenChange === 'function') {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("Erreur lors de la création du rendez-vous");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un rendez-vous</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!clientId}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un véhicule" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientVehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de rendez-vous</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="repair">Réparation</SelectItem>
                      <SelectItem value="diagnosis">Diagnostic</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
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
                    <Textarea placeholder="Notes ou instructions spécifiques..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Créer le rendez-vous</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAppointmentDialog;
