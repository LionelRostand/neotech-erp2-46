import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface CreateEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateEvaluationDialog: React.FC<CreateEvaluationDialogProps> = ({
  open,
  onOpenChange,
  onSuccess
}) => {
  const handleCreate = () => {
    // Create evaluation logic here
    if (onSuccess) {
      onSuccess();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle évaluation</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {/* Evaluation form goes here */}
          <p className="text-muted-foreground">Formulaire d'évaluation à implémenter</p>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleCreate}>
            Créer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEvaluationDialog;
