
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { Vehicle } from '../types/garage-types';
import { toast } from 'sonner';

interface EditVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: Vehicle;
  onUpdate: (id: string, data: Partial<Vehicle>) => Promise<void>;
  isLoading?: boolean;
}

const EditVehicleDialog = ({
  open,
  onOpenChange,
  vehicle,
  onUpdate,
  isLoading
}: EditVehicleDialogProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      licensePlate: vehicle.licensePlate,
      mileage: vehicle.mileage,
      lastCheckDate: vehicle.lastCheckDate,
      status: vehicle.status
    }
  });

  const onSubmit = async (data: Partial<Vehicle>) => {
    try {
      await onUpdate(vehicle.id, data);
      onOpenChange(false);
      toast.success('Véhicule mis à jour avec succès');
    } catch (error) {
      console.error('Error updating vehicle:', error);
      toast.error('Erreur lors de la mise à jour du véhicule');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le véhicule</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">Marque</Label>
              <Input id="make" {...register('make')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Modèle</Label>
              <Input id="model" {...register('model')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Input id="year" type="number" {...register('year')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Immatriculation</Label>
              <Input id="licensePlate" {...register('licensePlate')} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mileage">Kilométrage</Label>
              <Input id="mileage" type="number" {...register('mileage')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastCheckDate">Dernier contrôle</Label>
              <Input id="lastCheckDate" type="date" {...register('lastCheckDate')} />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleDialog;
