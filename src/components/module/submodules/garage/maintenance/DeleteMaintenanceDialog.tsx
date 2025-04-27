
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
import { useQueryClient } from '@tanstack/react-query';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface DeleteMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  maintenanceId: string | null;
  onMaintenanceDeleted?: () => void;
}

const DeleteMaintenanceDialog = ({ 
  open, 
  onOpenChange, 
  maintenanceId,
  onMaintenanceDeleted
}: DeleteMaintenanceDialogProps) => {
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    if (!maintenanceId) return;
    
    try {
      const docRef = doc(db, COLLECTIONS.GARAGE.MAINTENANCE, maintenanceId);
      await deleteDoc(docRef);
      
      toast.success("Maintenance supprimée avec succès");
      queryClient.invalidateQueries({ queryKey: ['garage', 'maintenances'] });
      
      if (onMaintenanceDeleted) {
        onMaintenanceDeleted();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting maintenance:", error);
      toast.error("Erreur lors de la suppression de la maintenance");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Cela supprimera définitivement cette maintenance.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMaintenanceDialog;
