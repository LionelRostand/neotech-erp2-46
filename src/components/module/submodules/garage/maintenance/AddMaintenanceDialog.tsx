
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import MaintenanceForm from './MaintenanceForm';
import { useQueryClient } from '@tanstack/react-query';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface AddMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddMaintenanceDialog = ({ open, onOpenChange }: AddMaintenanceDialogProps) => {
  const queryClient = useQueryClient();
  
  const handleSubmit = async (data: any) => {
    try {
      await addDoc(collection(db, COLLECTIONS.GARAGE.MAINTENANCE), {
        ...data,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      });
      
      toast.success("Maintenance ajoutée avec succès");
      queryClient.invalidateQueries({ queryKey: ['garage', 'maintenances'] });
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
