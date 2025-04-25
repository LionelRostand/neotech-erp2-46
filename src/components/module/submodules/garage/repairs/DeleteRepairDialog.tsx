
import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DeleteRepairDialogProps {
  repairId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

const DeleteRepairDialog: React.FC<DeleteRepairDialogProps> = ({
  repairId,
  open,
  onOpenChange,
  onDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!repairId) return;
    
    setIsDeleting(true);
    try {
      const repairRef = doc(db, COLLECTIONS.GARAGE.REPAIRS, repairId);
      await deleteDoc(repairRef);
      
      toast.success('Réparation supprimée avec succès');
      
      // Call onDelete callback function to refresh data
      if (typeof onDelete === 'function') {
        onDelete();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de la réparation:', error);
      toast.error('Erreur lors de la suppression de la réparation');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer cette réparation ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. La réparation sera définitivement supprimée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRepairDialog;
