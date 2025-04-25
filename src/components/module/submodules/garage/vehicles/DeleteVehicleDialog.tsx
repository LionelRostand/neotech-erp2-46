
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGarageVehiclesOperations } from '@/hooks/garage/useGarageVehiclesOperations';

interface DeleteVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicleId: string;
  vehicleInfo: string;
  onDeleted: () => void;
}

const DeleteVehicleDialog = ({
  open,
  onOpenChange,
  vehicleId,
  vehicleInfo,
  onDeleted
}: DeleteVehicleDialogProps) => {
  const { deleteVehicle } = useGarageVehiclesOperations();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await deleteVehicle(vehicleId);
      if (success) {
        onDeleted();
        onOpenChange(false);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer le véhicule</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer le véhicule {vehicleInfo} ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteVehicleDialog;
