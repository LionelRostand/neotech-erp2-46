
import React from 'react';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';

interface FormActionsProps {
  onCancel: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({ onCancel }) => {
  const { getValues } = useFormContext();

  const validateHireDate = (): boolean => {
    const hireDate = getValues('hireDate');
    // DD/MM/YYYY format validation using regex
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    
    if (!dateRegex.test(hireDate)) {
      toast({
        title: "Erreur de validation",
        description: "La date d'embauche doit être au format DD/MM/YYYY",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.MouseEvent) => {
    if (!validateHireDate()) {
      e.preventDefault();
    }
  };

  return (
    <div className="flex justify-end space-x-4 pt-4">
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
      >
        Annuler
      </Button>
      <Button type="submit" onClick={handleSubmit}>Enregistrer</Button>
    </div>
  );
};

export default FormActions;
