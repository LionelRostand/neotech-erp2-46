
import React, { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";

interface MaintenanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  mechanics: any[];
  clients: any[];
  vehicles: any[];
  services: any[];
}

const MaintenanceForm = ({ onSubmit, onCancel, mechanics, clients, vehicles, services }: MaintenanceFormProps) => {
  const [selectedServices, setSelectedServices] = useState<Array<{ serviceId: string, quantity: number, cost: number }>>([]);
  const [totalCost, setTotalCost] = useState(0);

  const form = useForm({
    defaultValues: {
      clientId: '',
      mechanicId: '',
      vehicleId: '',
      date: new Date(),
      endDate: new Date(),
      description: '',
      services: [],
      status: 'scheduled' as 'scheduled' | 'in_progress' | 'completed' | 'cancelled',
      totalCost: 0,
    }
  });

  const handleServiceAdd = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const newService = {
        serviceId: service.id,
        quantity: 1,
        cost: service.cost
      };
      setSelectedServices([...selectedServices, newService]);
      updateTotalCost([...selectedServices, newService]);
    }
  };

  const updateTotalCost = (services: Array<{ serviceId: string, quantity: number, cost: number }>) => {
    const total = services.reduce((sum, service) => sum + (service.cost * service.quantity), 0);
    setTotalCost(total);
    form.setValue('totalCost', total);
  };

  const handleSubmit = (data: any) => {
    const formData = {
      ...data,
      services: selectedServices,
      totalCost,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                  {clients?.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mechanicId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mécanicien</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un mécanicien" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mechanics?.map((mechanic) => (
                    <SelectItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.name}
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
                  {vehicles?.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormLabel>Services</FormLabel>
          <Select onValueChange={handleServiceAdd}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Ajouter un service" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {services?.map((service) => (
                <SelectItem key={service.id} value={service.id}>
                  {service.name} - {service.cost}€
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedServices.length > 0 && (
            <div className="space-y-2">
              {selectedServices.map((service, index) => {
                const serviceDetails = services.find(s => s.id === service.serviceId);
                return (
                  <div key={index} className="flex items-center gap-4">
                    <span className="flex-1">{serviceDetails?.name}</span>
                    <Input
                      type="number"
                      min="1"
                      value={service.quantity}
                      onChange={(e) => {
                        const newServices = [...selectedServices];
                        newServices[index].quantity = parseInt(e.target.value);
                        setSelectedServices(newServices);
                        updateTotalCost(newServices);
                      }}
                      className="w-24"
                    />
                    <span>{service.cost * service.quantity}€</span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        const newServices = selectedServices.filter((_, i) => i !== index);
                        setSelectedServices(newServices);
                        updateTotalCost(newServices);
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Description de la maintenance" />
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

        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            Coût total: {totalCost}€
          </div>
          <div className="space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter la maintenance
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default MaintenanceForm;
