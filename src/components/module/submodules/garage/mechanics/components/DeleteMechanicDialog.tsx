
import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Mechanic } from '../../types/garage-types';
import { toast } from "sonner";

interface DeleteMechanicDialogProps {
  mechanic: Mechanic | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

const DeleteMechanicDialog = ({ mechanic, isOpen, onClose, onDelete }: DeleteMechanicDialogProps) => {
  if (!mechanic) return null;

  const handleDelete = async () => {
    try {
      await onDelete(mechanic.id);
      toast.success("Mécanicien supprimé avec succès");
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la suppression du mécanicien");
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le mécanicien {mechanic.firstName} {mechanic.lastName} ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMechanicDialog;
