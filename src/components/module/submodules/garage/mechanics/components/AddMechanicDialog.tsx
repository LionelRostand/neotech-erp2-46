
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface AddMechanicDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MechanicFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string[];
  status: string;
}

export function AddMechanicDialog({ open, onOpenChange }: AddMechanicDialogProps) {
  const { add } = useFirestore(COLLECTIONS.GARAGE.MECHANICS);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<MechanicFormData>({
    defaultValues: {
      status: 'available',
      specialization: []
    }
  });

  const onSubmit = async (data: MechanicFormData) => {
    try {
      await add({
        ...data,
        createdAt: new Date().toISOString()
      });
      toast.success('Mécanicien ajouté avec succès');
      reset();
      onOpenChange(false);
    } catch (error) {
      toast.error("Erreur lors de l'ajout du mécanicien");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un mécanicien</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                {...register("firstName", { required: "Ce champ est requis" })}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                {...register("lastName", { required: "Ce champ est requis" })}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email", { required: "Ce champ est requis" })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              {...register("phone", { required: "Ce champ est requis" })}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="specialization">Spécialisation</Label>
            <Input
              id="specialization"
              {...register("specialization")}
            />
          </div>

          <DialogFooter>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
