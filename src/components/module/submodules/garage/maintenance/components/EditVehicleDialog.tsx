
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Vehicle } from '../../../types/garage-types';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { toast } from 'sonner';

interface EditVehicleDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditVehicleDialog = ({ vehicle, open, onOpenChange }: EditVehicleDialogProps) => {
  const { updateVehicle } = useGarageVehicles();
  const { register, handleSubmit } = useForm<Vehicle>({
    defaultValues: vehicle || {}
  });

  const onSubmit = async (data: Vehicle) => {
    if (!vehicle?.id) return;
    
    try {
      await updateVehicle(vehicle.id, data);
      toast.success('Véhicule mis à jour avec succès');
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour du véhicule');
    }
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le véhicule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="brand">Marque</Label>
              <Input
                id="brand"
                className="col-span-3"
                {...register('brand')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model">Modèle</Label>
              <Input
                id="model"
                className="col-span-3"
                {...register('model')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="registrationNumber">Immatriculation</Label>
              <Input
                id="registrationNumber"
                className="col-span-3"
                {...register('registrationNumber')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mileage">Kilométrage</Label>
              <Input
                id="mileage"
                type="number"
                className="col-span-3"
                {...register('mileage')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Enregistrer les modifications</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleDialog;
