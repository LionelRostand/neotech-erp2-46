
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Vehicle } from '../../../types/garage-types';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { toast } from 'sonner';

interface DeleteVehicleDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const DeleteVehicleDialog = ({ vehicle, open, onOpenChange, onSuccess }: DeleteVehicleDialogProps) => {
  const { deleteVehicle } = useGarageVehicles();

  const handleDelete = async () => {
    if (!vehicle?.id) return;

    try {
      await deleteVehicle(vehicle.id);
      toast.success('Véhicule supprimé avec succès');
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du véhicule');
    }
  };

  const vehicleName = vehicle ? 
    `${vehicle.brand || vehicle.make || ''} ${vehicle.model || ''} (${vehicle.registrationNumber || vehicle.licensePlate || ''})` 
    : '';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action ne peut pas être annulée. Cela supprimera définitivement le véhicule
            {vehicle && ` ${vehicleName}`} de la base de données.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteVehicleDialog;
