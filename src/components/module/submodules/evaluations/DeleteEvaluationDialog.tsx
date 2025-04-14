
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AlertTriangle } from 'lucide-react';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { deleteDocument } from '@/hooks/firestore/delete-operations';

interface DeleteEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluationId: string;
  onSuccess?: () => void;
}

const DeleteEvaluationDialog: React.FC<DeleteEvaluationDialogProps> = ({ 
  open, 
  onOpenChange, 
  evaluationId,
  onSuccess
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!evaluationId) {
      toast.error('ID d\'évaluation manquant');
      return;
    }

    setIsDeleting(true);
    
    try {
      await deleteDocument(COLLECTIONS.HR.EVALUATIONS, evaluationId);
      toast.success('L\'évaluation a été supprimée avec succès');
      
      if (onSuccess) {
        onSuccess();
      }
      
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'évaluation:', error);
      toast.error('Erreur lors de la suppression de l\'évaluation');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer l'évaluation</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette évaluation ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="flex items-center p-4 bg-amber-50 text-amber-700 rounded-md">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <p className="text-sm">
              La suppression de cette évaluation entraînera la perte définitive de toutes les données associées.
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Annuler
          </Button>
          <Button 
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

export default DeleteEvaluationDialog;
