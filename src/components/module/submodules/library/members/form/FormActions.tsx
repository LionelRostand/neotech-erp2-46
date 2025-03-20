
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  mode: 'add' | 'edit';
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isSubmitting = false,
  mode 
}) => {
  return (
    <DialogFooter>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {mode === 'add' ? 'Ajouter' : 'Enregistrer'}
      </Button>
    </DialogFooter>
  );
};

export default FormActions;
