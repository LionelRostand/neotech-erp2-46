
import React from 'react';
import { useGarageMechanics } from '@/hooks/garage/useGarageMechanics';
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ServicesSelector from './ServicesSelector';
import type { RepairFormData } from './types';

interface RepairFormProps {
  onSubmit: (data: RepairFormData) => void;
  defaultValues?: Partial<RepairFormData>;
  isLoading?: boolean;
}

const RepairForm = ({ onSubmit, defaultValues, isLoading }: RepairFormProps) => {
  const form = useForm<RepairFormData>({
    defaultValues: {
      clientId: '',
      vehicleId: '',
      mechanicId: '',
      startDate: new Date().toISOString().split('T')[0],
      estimatedEndDate: '',
      status: 'pending',
      estimatedCost: 0,
      progress: 0,
      description: '',
      services: [],
      ...defaultValues
    }
  });

  const { mechanics } = useGarageMechanics();

  // Filter only available mechanics
  const availableMechanics = mechanics?.filter(m => m.status === 'available') || [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Input placeholder="Client ID" {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Véhicule</FormLabel>
              <Input placeholder="Vehicle ID" {...field} />
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
                  {availableMechanics.map((mechanic) => (
                    <SelectItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.firstName} {mechanic.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de début</FormLabel>
              <Input type="date" {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedEndDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de fin estimée</FormLabel>
              <Input type="date" {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="estimatedCost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Coût estimé</FormLabel>
              <Input type="number" placeholder="Coût estimé" {...field} />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="progress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Progression (%)</FormLabel>
              <Input
                type="number"
                placeholder="Progression en pourcentage"
                {...field}
              />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <Textarea placeholder="Description de la réparation" {...field} />
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
        
        <div className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "En cours..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RepairForm;
