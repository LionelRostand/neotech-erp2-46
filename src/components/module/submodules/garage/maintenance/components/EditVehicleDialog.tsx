
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditVehicleDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const EditVehicleDialog = ({ vehicle, open, onOpenChange, onSuccess }: EditVehicleDialogProps) => {
  const { updateVehicle } = useGarageVehicles();
  const { register, handleSubmit, setValue } = useForm<Vehicle>({
    defaultValues: vehicle || {}
  });

  React.useEffect(() => {
    if (vehicle) {
      // Set form values when vehicle changes
      setValue('brand', vehicle.brand || vehicle.make || '');
      setValue('model', vehicle.model || '');
      setValue('registrationNumber', vehicle.registrationNumber || vehicle.licensePlate || '');
      setValue('mileage', vehicle.mileage || 0);
      setValue('status', vehicle.status || 'active');
    }
  }, [vehicle, setValue]);

  const onSubmit = async (data: any) => {
    if (!vehicle?.id) return;
    
    try {
      // Normalize the data to match the expected format
      const normalizedData = {
        brand: data.brand,
        make: data.brand, // Also update the make field if it exists
        model: data.model,
        registrationNumber: data.registrationNumber,
        licensePlate: data.registrationNumber, // Also update licensePlate if it exists
        mileage: Number(data.mileage),
        status: data.status
      };

      await updateVehicle(vehicle.id, normalizedData);
      toast.success('Véhicule mis à jour avec succès');
      onOpenChange(false);
      if (onSuccess) onSuccess();
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
                {...register('mileage', { valueAsNumber: true })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status">Statut</Label>
              <Select
                onValueChange={(value) => setValue('status', value)}
                defaultValue={vehicle.status}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="maintenance">En maintenance</SelectItem>
                  <SelectItem value="unavailable">Indisponible</SelectItem>
                </SelectContent>
              </Select>
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
