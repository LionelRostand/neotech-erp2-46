
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
import { toast } from '@/components/ui/use-toast';

interface EditMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenance: any;
}

const EditMaintenanceDialog = ({ 
  open, 
  onOpenChange,
  maintenance 
}: EditMaintenanceDialogProps) => {
  const queryClient = useQueryClient();

  const handleSubmit = async (data: any) => {
    try {
      if (!maintenance || !maintenance.id) {
        toast({
          title: "Erreur",
          description: "ID de maintenance manquant",
          variant: "destructive",
        });
        return;
      }
      
      const maintenanceRef = doc(db, 'garage_maintenances', maintenance.id);
      
      // Add update timestamp
      data.updatedAt = new Date().toISOString();
      
      // Ensure data is not undefined
      const safeData = {
        ...data,
        date: data.date || new Date().toISOString(),
        status: data.status || 'pending',
        description: data.description || '',
        totalCost: data.totalCost !== undefined ? data.totalCost : 0,
      };
      
      await updateDoc(maintenanceRef, safeData);
      
      toast({
        title: "Succès",
        description: "Maintenance mise à jour avec succès",
      });
      
      queryClient.invalidateQueries({ queryKey: ['garage', 'maintenances'] });
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating maintenance:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour de la maintenance",
        variant: "destructive",
      });
    }
  };

  if (!maintenance) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
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
