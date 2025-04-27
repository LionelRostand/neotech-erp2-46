
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GarageMaintenance } from '@/hooks/garage/useGarageData';
import MaintenanceForm from './MaintenanceForm';
import { updateDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface EditMaintenanceDialogProps {
  maintenance: GarageMaintenance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const EditMaintenanceDialog = ({ maintenance, open, onOpenChange, onUpdate }: EditMaintenanceDialogProps) => {
  if (!maintenance) return null;

  const handleSubmit = async (data: any) => {
    try {
      await updateDocument(COLLECTIONS.GARAGE.MAINTENANCE, maintenance.id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      toast.success("Maintenance mise à jour avec succès");
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating maintenance:", error);
      toast.error("Erreur lors de la mise à jour de la maintenance");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier la maintenance</DialogTitle>
        </DialogHeader>
        <MaintenanceForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          initialData={maintenance}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditMaintenanceDialog;
