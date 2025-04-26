
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';

interface MaintenanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  mechanics: any[];
  clients: any[];
  vehicles: any[];
  services: any[];
}

const MaintenanceForm = ({ onSubmit, onCancel, mechanics, clients, vehicles, services }: MaintenanceFormProps) => {
  const form = useForm({
    defaultValues: {
      date: new Date(),
      endDate: new Date(),
      clientId: '',
      mechanicId: '',
      vehicleId: '',
      services: [],
      status: 'scheduled',
      notes: '',
      totalCost: 0
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date de début</FormLabel>
                <FormControl>
                  <DatePicker 
                    date={field.value} 
                    onSelect={field.onChange}
                  />
                </FormControl>
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
                  <DatePicker 
                    date={field.value} 
                    onSelect={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Sélectionner un client</option>
                    {clients.map((client: any) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mechanicId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mécanicien</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Sélectionner un mécanicien</option>
                    {mechanics.map((mechanic: any) => (
                      <option key={mechanic.id} value={mechanic.id}>
                        {mechanic.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Véhicule</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Sélectionner un véhicule</option>
                  {vehicles.map((vehicle: any) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model}
                    </option>
                  ))}
                </select>
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4 mt-6">
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
