
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
import { toast } from 'sonner';

interface AddMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddMaintenanceDialog = ({ open, onOpenChange }: AddMaintenanceDialogProps) => {
  const queryClient = useQueryClient();
  
  const handleSubmit = async (data: any) => {
    try {
      // Ensure no undefined values are sent to Firestore
      const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);
      
      // Add creation timestamp
      cleanData.createdAt = new Date().toISOString();
      cleanData.updatedAt = new Date().toISOString();
      
      // Add to Firestore
      await addDoc(collection(db, 'garage_maintenances'), cleanData);
      
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
