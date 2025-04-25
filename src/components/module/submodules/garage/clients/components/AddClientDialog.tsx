
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { useForm } from 'react-hook-form';

interface AddClientDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddClientDialog = ({ isOpen, onOpenChange }: AddClientDialogProps) => {
  const { addClient } = useGarageClients();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data: any) => {
    try {
      // Ajout du status et createdAt par défaut
      const clientData = {
        ...data,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      await addClient.mutateAsync(clientData);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                {...register('firstName')}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                {...register('lastName')}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                {...register('phone')}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              {...register('address')}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              {...register('notes')}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter le client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientDialog;
