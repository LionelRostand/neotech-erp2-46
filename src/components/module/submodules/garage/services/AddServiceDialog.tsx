
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
import { Textarea } from '@/components/ui/textarea';
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

const serviceFormSchema = z.object({
  vehicleInfo: z.string().min(1, "Les informations du véhicule sont requises"),
  description: z.string().min(1, "La description est requise"),
  mechanicName: z.string().min(1, "Le nom du mécanicien est requis"),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddServiceDialog({ open, onOpenChange }: AddServiceDialogProps) {
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      vehicleInfo: '',
      description: '',
      mechanicName: '',
    },
  });

  const { add } = useFirestore(COLLECTIONS.GARAGE.SERVICES);

  const onSubmit = async (data: ServiceFormData) => {
    try {
      await add({
        ...data,
        date: new Date().toISOString(),
        status: 'pending',
        progress: 0,
      });
      toast.success('Réparation ajoutée avec succès');
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la réparation");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter une réparation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vehicleInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Véhicule</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Peugeot 308 2020" {...field} />
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
                    <Textarea placeholder="Description de la réparation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mechanicName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mécanicien</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom du mécanicien" {...field} />
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
