
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

interface DeleteVehicleDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteVehicleDialog: React.FC<DeleteVehicleDialogProps> = ({
  vehicle,
  open,
  onOpenChange,
  onSuccess
}) => {
  const { deleteVehicle } = useGarageVehicles();

  if (!vehicle) return null;

  const handleDelete = async () => {
    try {
      await deleteVehicle(vehicle.id);
      toast.success('Véhicule supprimé avec succès');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la suppression du véhicule');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le véhicule {vehicle.make} {vehicle.model} ({vehicle.licensePlate}) ?
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteVehicleDialog;
