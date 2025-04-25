
import React from 'react';
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mechanic } from '../../types/garage-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface EditMechanicDialogProps {
  mechanic: Mechanic | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Mechanic>) => Promise<void>;
}

const EditMechanicDialog = ({ mechanic, isOpen, onClose, onUpdate }: EditMechanicDialogProps) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: mechanic || {}
  });

  if (!mechanic) return null;

  const onSubmit = async (data: Partial<Mechanic>) => {
    try {
      await onUpdate(mechanic.id, data);
      toast.success("Mécanicien mis à jour avec succès");
      onClose();
    } catch (error) {
      console.error('Error updating mechanic:', error);
      toast.error("Erreur lors de la mise à jour du mécanicien");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le mécanicien</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="firstName" className="text-right">Prénom</label>
              <Input
                id="firstName"
                defaultValue={mechanic.firstName}
                className="col-span-3"
                {...register('firstName')}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="lastName" className="text-right">Nom</label>
              <Input
                id="lastName"
                defaultValue={mechanic.lastName}
                className="col-span-3"
                {...register('lastName')}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">Email</label>
              <Input
                id="email"
                type="email"
                defaultValue={mechanic.email}
                className="col-span-3"
                {...register('email')}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right">Téléphone</label>
              <Input
                id="phone"
                defaultValue={mechanic.phone}
                className="col-span-3"
                {...register('phone')}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="specialization" className="text-right">Spécialisation</label>
              <Input
                id="specialization"
                defaultValue={Array.isArray(mechanic.specialization) ? mechanic.specialization.join(', ') : mechanic.specialization}
                className="col-span-3"
                {...register('specialization')}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">Statut</label>
              <Select defaultValue={mechanic.status} onValueChange={(value) => register('status').onChange({ target: { value } })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="in_service">En service</SelectItem>
                  <SelectItem value="on_break">En pause</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMechanicDialog;
