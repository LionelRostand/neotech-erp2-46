
import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CustomerSelector } from "@/components/selectors/CustomerSelector";
import { MechanicSelector } from "./components/MechanicSelector";
import { ServicesSelector } from "../services/ServicesSelector";
import { useForm } from "react-hook-form";

interface RepairFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const RepairForm: React.FC<RepairFormProps> = ({ onSubmit, initialData = {} }) => {
  const form = useForm({
    defaultValues: {
      clientId: initialData.clientId || '',
      clientName: initialData.clientName || '',
      mechanicId: initialData.mechanicId || '',
      vehicleInfo: initialData.vehicleInfo || '',
      description: initialData.description || '',
      estimatedTime: initialData.estimatedTime || '',
      services: initialData.services || []
    }
  });

  const handleSubmit = (data: any) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <FormControl>
                <CustomerSelector
                  value={field.value}
                  onChange={(value, name) => {
                    field.onChange(value);
                    form.setValue('clientName', name);
                  }}
                />
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
                <MechanicSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicleInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informations du véhicule</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description de la réparation</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temps estimé</FormLabel>
              <FormControl>
                <Input {...field} type="text" placeholder="Ex: 2 heures" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services</FormLabel>
              <FormControl>
                <ServicesSelector
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {initialData.id ? 'Mettre à jour la réparation' : 'Créer la réparation'}
        </Button>
      </form>
    </Form>
  );
};
