
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Vehicle } from '../../types/rental-types';
import { toast } from 'sonner';
import { addDocument } from '@/hooks/firestore/create-operations';

interface CreateVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type VehicleFormData = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;

const CreateVehicleDialog: React.FC<CreateVehicleDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<VehicleFormData>();

  const onSubmit = async (data: VehicleFormData) => {
    try {
      await addDocument('VEHICLE_RENTALS_VEHICLES', {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      toast.success('Véhicule ajouté avec succès');
      reset();
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('Erreur lors de l\'ajout du véhicule');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Marque</Label>
                <Input
                  id="brand"
                  {...register('brand', { required: true })}
                />
              </div>
              <div>
                <Label htmlFor="model">Modèle</Label>
                <Input
                  id="model"
                  {...register('model', { required: true })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Année</Label>
                <Input
                  id="year"
                  type="number"
                  {...register('year', { required: true, min: 1900 })}
                />
              </div>
              <div>
                <Label htmlFor="licensePlate">Immatriculation</Label>
                <Input
                  id="licensePlate"
                  {...register('licensePlate', { required: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">Type</Label>
                <Select onValueChange={(value) => register('type').onChange({target:{value}})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Berline</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="luxury">Luxe</SelectItem>
                    <SelectItem value="hatchback">Compacte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="dailyRate">Tarif journalier (€)</Label>
                <Input
                  id="dailyRate"
                  type="number"
                  {...register('dailyRate', { required: true, min: 0 })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="mileage">Kilométrage</Label>
              <Input
                id="mileage"
                type="number"
                {...register('mileage', { required: true, min: 0 })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lastMaintenanceDate">Dernière maintenance</Label>
                <Input
                  id="lastMaintenanceDate"
                  type="date"
                  {...register('lastMaintenanceDate')}
                />
              </div>
              <div>
                <Label htmlFor="nextMaintenanceDate">Prochaine maintenance</Label>
                <Input
                  id="nextMaintenanceDate"
                  type="date"
                  {...register('nextMaintenanceDate')}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                {...register('notes')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter le véhicule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVehicleDialog;
