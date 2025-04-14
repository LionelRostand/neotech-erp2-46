
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Training } from '@/hooks/useTrainingsData';

interface DeleteTrainingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  training: Training | null;
}

const DeleteTrainingDialog: React.FC<DeleteTrainingDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  training,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!training) return;
    
    setIsDeleting(true);
    
    try {
      await deleteDocument(COLLECTIONS.HR.TRAININGS, training.id);
      toast.success(`La formation "${training.title}" a été supprimée`);
      onConfirm();
    } catch (error) {
      console.error('Erreur lors de la suppression de la formation:', error);
      toast.error('Erreur lors de la suppression de la formation');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!training) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer la formation</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la formation "{training.title}" ?
            Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTrainingDialog;
