
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
import { LoyaltyProgram } from '../types/loyalty-types';
import { toast } from 'sonner';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface DeleteLoyaltyProgramDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  program: LoyaltyProgram | null;
  onSuccess: () => void;
}

const DeleteLoyaltyProgramDialog: React.FC<DeleteLoyaltyProgramDialogProps> = ({
  open,
  onOpenChange,
  program,
  onSuccess
}) => {
  if (!open) return null;
  
  const handleDelete = async () => {
    if (!program || !program.id) {
      console.error("Programme invalide ou ID manquant");
      toast.error("Impossible de supprimer ce programme");
      onOpenChange(false);
      return;
    }

    try {
      // Delete the program from Firebase
      await deleteDoc(doc(db, COLLECTIONS.GARAGE.LOYALTY, program.id));
      
      // Show success toast
      toast.success("Programme de fidélité supprimé avec succès");
      
      // Close the dialog and refresh the list
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la suppression du programme:", error);
      toast.error("Une erreur est survenue lors de la suppression");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmation de suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer le programme de fidélité "{program?.name}" ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteLoyaltyProgramDialog;
