
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MaintenanceForm from './MaintenanceForm';
import { useQueryClient } from '@tanstack/react-query';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface AddMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMaintenanceAdded?: () => void;
}

const AddMaintenanceDialog = ({ open, onOpenChange, onMaintenanceAdded }: AddMaintenanceDialogProps) => {
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      // Add timestamp fields
      const maintenanceData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Add document to Firestore
      const collectionRef = collection(db, COLLECTIONS.GARAGE.MAINTENANCE);
      await addDoc(collectionRef, maintenanceData);
      
      toast.success("Maintenance ajoutée avec succès");
      queryClient.invalidateQueries({ queryKey: ['garage', 'maintenances'] });
      
      if (onMaintenanceAdded) {
        onMaintenanceAdded();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding maintenance:", error);
      toast.error("Erreur lors de l'ajout de la maintenance");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une maintenance</DialogTitle>
        </DialogHeader>
        <MaintenanceForm 
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddMaintenanceDialog;
