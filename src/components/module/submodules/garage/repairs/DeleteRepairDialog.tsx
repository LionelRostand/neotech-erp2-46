
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
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface DeleteRepairDialogProps {
  repairId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export const DeleteRepairDialog: React.FC<DeleteRepairDialogProps> = ({
  repairId,
  open,
  onOpenChange,
  onDelete
}) => {
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    if (!repairId) return;

    setIsDeleting(true);
    try {
      const repairRef = doc(db, COLLECTIONS.GARAGE.REPAIRS, repairId);
      await deleteDoc(repairRef);
      
      toast.success('Réparation supprimée avec succès');
      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting repair:', error);
      toast.error('Erreur lors de la suppression de la réparation');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette réparation ? Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRepairDialog;
