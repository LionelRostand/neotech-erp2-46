
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

const mechanicFormSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  specialization: z.string().min(1, "La spécialisation est requise"),
  experience: z.string().min(1, "L'expérience est requise"),
});

type MechanicFormData = z.infer<typeof mechanicFormSchema>;

interface AddMechanicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddMechanicDialog({ open, onOpenChange }: AddMechanicDialogProps) {
  const form = useForm<MechanicFormData>({
    resolver: zodResolver(mechanicFormSchema),
    defaultValues: {
      name: '',
      specialization: '',
      experience: '',
    },
  });

  const { add } = useFirestore(COLLECTIONS.GARAGE.MECHANICS);

  const onSubmit = async (data: MechanicFormData) => {
    try {
      await add({
        ...data,
        status: 'available',
        createdAt: new Date().toISOString(),
      });
      toast.success('Mécanicien ajouté avec succès');
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du mécanicien');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un mécanicien</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spécialisation</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Moteur, Électricité..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Années d'expérience</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="5" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
