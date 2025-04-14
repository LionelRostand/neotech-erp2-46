
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
} from '@/components/ui/alert-dialog';
import { deleteDocument } from '@/hooks/firestore/delete-operations';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface DeleteEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  evaluation: any | null;
}

const DeleteEvaluationDialog: React.FC<DeleteEvaluationDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  evaluation
}) => {
  const handleDelete = async () => {
    if (!evaluation || !evaluation.id) {
      toast.error("Impossible de supprimer l'évaluation: ID manquant");
      return;
    }

    try {
      await deleteDocument(COLLECTIONS.HR.EVALUATIONS, evaluation.id);
      toast.success("Évaluation supprimée avec succès");
      onConfirm();
    } catch (error) {
      console.error("Erreur lors de la suppression de l'évaluation:", error);
      toast.error("Erreur lors de la suppression de l'évaluation");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer cette évaluation ?
            {evaluation && (
              <div className="mt-2 bg-muted p-3 rounded-md">
                <p><strong>Employé:</strong> {evaluation.employeeName}</p>
                <p><strong>Date:</strong> {evaluation.date}</p>
                {evaluation.title && (
                  <p><strong>Titre:</strong> {evaluation.title}</p>
                )}
              </div>
            )}
            <p className="mt-2 text-red-600 font-medium">Cette action ne peut pas être annulée.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteEvaluationDialog;
