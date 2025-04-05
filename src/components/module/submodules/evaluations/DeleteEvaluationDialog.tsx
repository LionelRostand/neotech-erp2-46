
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Evaluation } from '@/hooks/useEvaluationsData';
import { AlertTriangle } from 'lucide-react';

interface DeleteEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: Evaluation;
  onDelete: () => void;
}

const DeleteEvaluationDialog: React.FC<DeleteEvaluationDialogProps> = ({
  open,
  onOpenChange,
  evaluation,
  onDelete,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer l'évaluation</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer cette évaluation ? Cette action est irréversible.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center p-4 my-4 border border-red-100 bg-red-50 rounded-md">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-3" />
          <div>
            <p className="font-medium text-red-800">Évaluation de {evaluation.employeeName}</p>
            <p className="text-red-700 text-sm">Date: {evaluation.date}</p>
            <p className="text-red-700 text-sm">Statut: {evaluation.status}</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            variant="destructive" 
            onClick={onDelete}
          >
            Supprimer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteEvaluationDialog;
