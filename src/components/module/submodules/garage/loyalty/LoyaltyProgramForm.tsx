
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoyaltyProgram } from '../types/loyalty-types';

const formSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  pointsMultiplier: z.number().min(1, 'Le multiplicateur doit être supérieur à 0'),
  minimumSpend: z.number().min(0, 'Le montant minimum ne peut pas être négatif'),
  benefitsDescription: z.string().min(10, 'La description des avantages doit contenir au moins 10 caractères'),
  startDate: z.string().min(1, 'La date de début est requise'),
  endDate: z.string().optional(),
});

interface LoyaltyProgramFormProps {
  onSubmit: (data: Partial<LoyaltyProgram>) => void;
  onCancel: () => void;
}

const LoyaltyProgramForm = ({ onSubmit, onCancel }: LoyaltyProgramFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      pointsMultiplier: 1,
      minimumSpend: 0,
      benefitsDescription: '',
      startDate: new Date().toISOString().split('T')[0],
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du programme</FormLabel>
              <FormControl>
                <Input placeholder="Programme VIP..." {...field} />
              </FormControl>
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
                <Textarea placeholder="Description du programme..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pointsMultiplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Multiplicateur de points</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.1"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="minimumSpend"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dépense minimum (€)</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="benefitsDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description des avantages</FormLabel>
              <FormControl>
                <Textarea placeholder="Avantages offerts..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
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
                <FormLabel>Date de fin (optionnel)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Créer le programme
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoyaltyProgramForm;
