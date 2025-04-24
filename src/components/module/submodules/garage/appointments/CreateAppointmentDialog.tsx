
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useGarageClients } from "@/hooks/garage/useGarageClients";
import { useGarageVehicles } from "@/hooks/garage/useGarageVehicles";
import { useGarageServices } from "@/hooks/garage/useGarageServices";
import { useState } from "react";
import { useGarageAppointments } from "@/hooks/garage/useGarageAppointments";
import { toast } from "sonner";

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateAppointmentDialog = ({ open, onOpenChange, onSuccess }: CreateAppointmentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { clients } = useGarageClients();
  const { vehicles } = useGarageVehicles();
  const { services } = useGarageServices();
  const { addAppointment } = useGarageAppointments();
  
  const form = useForm({
    defaultValues: {
      clientId: "",
      date: "",
      time: "",
      serviceId: "",
      vehicleId: "",
      notes: ""
    }
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      // Trouver le nom du client sélectionné
      const selectedClient = clients.find(client => client.id === data.clientId);
      const clientName = selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : 'Client inconnu';
      
      // Trouver le nom du service sélectionné
      const selectedService = services.find(service => service.id === data.serviceId);
      const serviceName = selectedService ? selectedService.name : 'Service non spécifié';
      
      await addAppointment({
        clientId: data.clientId,
        clientName: clientName,
        vehicleId: data.vehicleId,
        service: serviceName,
        date: data.date,
        time: data.time,
        status: 'scheduled',
        notes: data.notes || '',
        createdAt: new Date().toISOString()
      });
      
      toast.success("Rendez-vous créé avec succès");
      form.reset();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      toast.error("Erreur lors de la création du rendez-vous");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Prendre un rendez-vous</DialogTitle>
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
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de service</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                          {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description / Commentaires</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Décrivez le problème ou la raison du rendez-vous" />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Création...' : 'Créer'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;
