
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from './employeeFormSchema';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  form?: UseFormReturn<EmployeeFormValues>;
  showManagerOption?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isSubmitting = false
}) => {
  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="secondary" 
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Annuler
      </Button>
      <Button 
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enregistrement...
          </>
        ) : (
          'Enregistrer'
        )}
      </Button>
    </div>
  );
};

export default FormActions;
