import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Evaluation } from '@/hooks/useEvaluationsData';

export interface EditEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: Evaluation | null;
  onSuccess?: () => void;
}

const EditEvaluationDialog: React.FC<EditEvaluationDialogProps> = ({
  open,
  onOpenChange,
  evaluation,
  onSuccess
}) => {
  const handleSave = () => {
    // Save evaluation logic here
    if (onSuccess) {
      onSuccess();
    }
    onOpenChange(false);
  };

  if (!evaluation) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'évaluation</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Evaluation edit form goes here */}
          <p className="text-muted-foreground">Formulaire de modification à implémenter</p>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditEvaluationDialog;
