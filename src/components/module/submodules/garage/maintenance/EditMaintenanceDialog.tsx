
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MaintenanceForm from './MaintenanceForm';
import { useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface EditMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: any | null;
}

const EditMaintenanceDialog = ({ open, onOpenChange, maintenance }: EditMaintenanceDialogProps) => {
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    if (!maintenance?.id) return;
    
    try {
      const docRef = doc(db, COLLECTIONS.GARAGE.MAINTENANCE, maintenance.id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      toast.success("Maintenance mise à jour avec succès");
      queryClient.invalidateQueries({ queryKey: ['garage', 'maintenances'] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating maintenance:", error);
      toast.error("Erreur lors de la mise à jour de la maintenance");
    }
  };

  if (!maintenance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier la maintenance</DialogTitle>
        </DialogHeader>
        <MaintenanceForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          defaultValues={maintenance}
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditMaintenanceDialog;
