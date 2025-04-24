
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LoyaltyProgram } from '../types/loyalty-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const loyaltyProgramSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  pointsPerEuro: z.number().min(1, "Doit être au moins 1").or(z.string().transform(val => Number(val))),
  rewardThreshold: z.number().min(1, "Doit être au moins 1").or(z.string().transform(val => Number(val))),
  discount: z.number().min(1, "Doit être au moins 1").max(100, "Ne peut pas dépasser 100%").or(z.string().transform(val => Number(val))),
  type: z.enum(["percentage", "fixed", "points"]),
});

type FormData = z.infer<typeof loyaltyProgramSchema>;

interface LoyaltyProgramFormProps {
  onSubmit: (data: Partial<LoyaltyProgram>) => void;
  onCancel: () => void;
  initialData?: Partial<LoyaltyProgram>;
}

const LoyaltyProgramForm = ({ onSubmit, onCancel, initialData }: LoyaltyProgramFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(loyaltyProgramSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      pointsPerEuro: initialData?.pointsPerEuro || 1,
      rewardThreshold: initialData?.rewardThreshold || 100,
      discount: initialData?.discount || 10,
      type: initialData?.type || 'percentage',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit({
      ...data,
      pointsPerEuro: Number(data.pointsPerEuro),
      rewardThreshold: Number(data.rewardThreshold),
      discount: Number(data.discount),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du programme</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Fidélité Premium" {...field} />
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
                <Textarea 
                  placeholder="Décrivez les avantages du programme de fidélité..." 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pointsPerEuro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Points par euro</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rewardThreshold"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Seuil de récompense (points)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de récompense</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage</SelectItem>
                    <SelectItem value="fixed">Montant fixe</SelectItem>
                    <SelectItem value="points">Points</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="discount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valeur de la récompense</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            {initialData ? 'Mettre à jour' : 'Créer le programme'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoyaltyProgramForm;
