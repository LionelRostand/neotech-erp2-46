
import React from 'react';
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useMaintenanceForm } from './hooks/useMaintenanceForm';
import { Checkbox } from "@/components/ui/checkbox";

interface MaintenanceFormProps {
  onCancel: () => void;
}

const MaintenanceForm = ({ onCancel }: MaintenanceFormProps) => {
  const {
    form,
    services,
    clients,
    vehicles,
    mechanics,
    isLoading,
    calculateTotalCost,
  } = useMaintenanceForm();

  const [totalCost, setTotalCost] = React.useState(0);

  const onSubmit = (data: any) => {
    console.log(data);
    // TODO: Implement form submission
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
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
                  {clients.map((client: any) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un véhicule" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {vehicles.map((vehicle: any) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.model} - {vehicle.licensePlate}
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
          name="mechanicId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mécanicien</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un mécanicien" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mechanics.map((mechanic: any) => (
                    <SelectItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.name}
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
          name="services"
          render={() => (
            <FormItem>
              <FormLabel>Services</FormLabel>
              <div className="space-y-2">
                {services.map((service: any) => (
                  <div key={service.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={service.id}
                      onCheckedChange={(checked) => {
                        const currentServices = form.getValues("services");
                        const updatedServices = checked
                          ? [...currentServices, service.id]
                          : currentServices.filter((id) => id !== service.id);
                        form.setValue("services", updatedServices);
                        setTotalCost(calculateTotalCost(updatedServices));
                      }}
                    />
                    <label htmlFor={service.id} className="flex items-center justify-between w-full text-sm">
                      <span>{service.name}</span>
                      <span className="text-muted-foreground">{service.cost}€</span>
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-right font-semibold">
                Total: {totalCost}€
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Description de la maintenance" />
              </FormControl>
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
          name="estimatedEndDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de fin estimée</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Ajouter
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MaintenanceForm;
