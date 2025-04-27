
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
import { deleteDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface DeleteMaintenanceDialogProps {
  maintenanceId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

const DeleteMaintenanceDialog = ({ maintenanceId, open, onOpenChange, onDelete }: DeleteMaintenanceDialogProps) => {
  const handleDelete = async () => {
    if (!maintenanceId) return;

    try {
      await deleteDocument(COLLECTIONS.GARAGE.MAINTENANCE, maintenanceId);
      toast.success("Maintenance supprimée avec succès");
      onDelete();
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
            Cette action est irréversible. Cela supprimera définitivement la maintenance.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMaintenanceDialog;
