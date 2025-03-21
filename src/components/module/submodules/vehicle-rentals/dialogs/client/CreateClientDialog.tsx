
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Client } from '../../types/rental-types';
import { addDocument } from '@/hooks/firestore/create-operations';
import { toast } from 'sonner';

const clientSchema = z.object({
  firstName: z.string().min(2, { message: 'Le prénom doit comporter au moins 2 caractères' }),
  lastName: z.string().min(2, { message: 'Le nom doit comporter au moins 2 caractères' }),
  email: z.string().email({ message: 'Adresse e-mail invalide' }),
  phone: z.string().min(10, { message: 'Numéro de téléphone invalide' }),
  address: z.string().min(5, { message: 'Adresse invalide' }),
  drivingLicenseNumber: z.string().min(5, { message: 'Numéro de permis invalide' }),
  drivingLicenseExpiry: z.string().min(1, { message: 'Date d\'expiration requise' }),
  idNumber: z.string().min(5, { message: 'Numéro d\'identité invalide' }),
  birthDate: z.string().min(1, { message: 'Date de naissance requise' }),
  nationality: z.string().min(2, { message: 'Nationalité requise' }),
  notes: z.string().optional(),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface CreateClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: Client) => void;
}

const CreateClientDialog: React.FC<CreateClientDialogProps> = ({
  isOpen,
  onClose,
  onClientCreated,
}) => {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      drivingLicenseNumber: '',
      drivingLicenseExpiry: '',
      idNumber: '',
      birthDate: '',
      nationality: 'Française',
      notes: '',
    },
  });

  const onSubmit = async (values: ClientFormValues) => {
    try {
      const newClient = {
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Dans un environnement de production, utilisez addDocument pour ajouter à Firestore
      // const clientWithId = await addDocument('clients', newClient);
      
      // Pour la démonstration, nous simulons l'ajout d'un ID
      const clientWithId = {
        id: `c${Math.floor(Math.random() * 1000)}`,
        ...newClient,
      };
      
      onClientCreated(clientWithId as Client);
      toast.success('Client ajouté avec succès');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du client:', error);
      toast.error('Erreur lors de la création du client');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau client</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Prénom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input placeholder="Téléphone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Adresse" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="drivingLicenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro de permis</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro de permis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="drivingLicenseExpiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiration du permis</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="idNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numéro d'identité</FormLabel>
                    <FormControl>
                      <Input placeholder="Numéro d'identité" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de naissance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationalité</FormLabel>
                    <FormControl>
                      <Input placeholder="Nationalité" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Notes (optionnel)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
              <Button type="submit">Créer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientDialog;
