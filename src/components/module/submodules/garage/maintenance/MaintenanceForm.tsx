
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
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface MaintenanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  mechanics: any[];
  clients: any[];
  vehicles: any[];
  services: any[];
}

interface ServiceLine {
  serviceId: string;
  quantity: number;
  cost: number;
}

const MaintenanceForm = ({ onSubmit, onCancel, mechanics, clients, vehicles, services }: MaintenanceFormProps) => {
  const form = useForm({
    defaultValues: {
      clientId: '',
      mechanicId: '',
      vehicleId: '',
      services: [] as ServiceLine[],
      description: '',
      date: new Date(),
      endDate: new Date(),
      status: 'scheduled',
      totalCost: 0
    }
  });

  const [selectedServices, setSelectedServices] = React.useState<ServiceLine[]>([]);
  const totalCost = selectedServices.reduce((sum, service) => sum + (service.cost * service.quantity), 0);

  const handleAddService = () => {
    setSelectedServices([...selectedServices, { serviceId: '', quantity: 1, cost: 0 }]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Services</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={handleAddService}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Ajouter un service
            </Button>
          </div>
          
          {selectedServices.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>Service</div>
              <div>Quantité</div>
              <div>Coût (€)</div>
            </div>
          )}
          
          {selectedServices.map((_, index) => (
            <div key={index} className="grid grid-cols-3 gap-4">
              <select
                className="w-full p-2 border rounded"
                onChange={(e) => {
                  const service = services.find(s => s.id === e.target.value);
                  const newServices = [...selectedServices];
                  newServices[index] = {
                    ...newServices[index],
                    serviceId: e.target.value,
                    cost: service?.cost || 0
                  };
                  setSelectedServices(newServices);
                }}
              >
                <option value="">Sélectionner un service</option>
                {services.map((service: any) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              <Input
                type="number"
                min="1"
                value={selectedServices[index].quantity}
                onChange={(e) => {
                  const newServices = [...selectedServices];
                  newServices[index] = {
                    ...newServices[index],
                    quantity: parseInt(e.target.value) || 1
                  };
                  setSelectedServices(newServices);
                }}
              />
              <Input
                type="number"
                value={selectedServices[index].cost}
                readOnly
              />
            </div>
          ))}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description de la maintenance"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

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

        <div className="flex justify-between items-center py-4 border-t mt-4">
          <div className="font-medium">
            Coût total: {totalCost}€
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Ajouter la maintenance
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default MaintenanceForm;
