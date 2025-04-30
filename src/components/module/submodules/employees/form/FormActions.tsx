
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from './employeeFormSchema';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { isEmployeeManager } from '@/components/module/submodules/employees/utils/employeeUtils';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  form?: UseFormReturn<EmployeeFormValues>;
  showManagerOption?: boolean;
  error?: Error | null;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isSubmitting = false,
  form,
  showManagerOption = true,
  error
}) => {
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();
  
  // Ensure employees is always an array even if undefined
  useEffect(() => {
    // Guard against undefined or non-array employees
    if (employees && Array.isArray(employees) && form) {
      const position = form.getValues('position');
      const forceManager = form.getValues('forceManager');
      
      if (position && !forceManager) {
        const shouldBeManager = isEmployeeManager(position);
        if (shouldBeManager) {
          form.setValue('forceManager', true);
        }
      }
    }
  }, [employees, isLoadingEmployees, form]);
  
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default FormActions;
