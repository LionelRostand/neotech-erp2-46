
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from './employeeFormSchema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { isEmployeeManager } from '@/components/module/submodules/employees/utils/employeeUtils';
import { useFirebaseDepartments } from '@/hooks/useFirebaseDepartments';

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
  const { employees = [], isLoading: isLoadingEmployees } = useEmployeeData();
  const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);
  
  // Safely filter and sort employees
  useEffect(() => {
    try {
      // Ensure employees is a valid array before processing
      const safeEmployees = Array.isArray(employees) ? employees : [];
      
      // Make sure we're not working with undefined or null employees
      const validEmployees = safeEmployees.filter(emp => emp != null);
      
      if (validEmployees.length > 0) {
        const managerEmployees = validEmployees.filter(emp => 
          emp && (
            (emp.isManager === true) || 
            (typeof emp.position === 'string' && isEmployeeManager(emp.position)) || 
            (typeof emp.role === 'string' && isEmployeeManager(emp.role))
          )
        );
        
        const sorted = [...managerEmployees].sort((a, b) => {
          const nameA = `${a.lastName || ''} ${a.firstName || ''}`.toLowerCase();
          const nameB = `${b.lastName || ''} ${b.firstName || ''}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        
        setSortedEmployees(sorted);
        
        // Only update form if it exists and has setValue method
        if (form?.setValue && form?.getValues) {
          const position = form.getValues('position');
          const forceManager = form.getValues('forceManager');
          
          if (position && !forceManager && typeof position === 'string') {
            const shouldBeManager = isEmployeeManager(position);
            if (shouldBeManager) {
              form.setValue('forceManager', true);
            }
          }
        }
      } else {
        // If employees is undefined, empty, or invalid, set an empty array
        setSortedEmployees([]);
      }
    } catch (err) {
      console.error('Error processing employees in FormActions:', err);
      setSortedEmployees([]);
    }
  }, [employees, isLoadingEmployees, form]);
  
  // Ensure form exists before accessing its methods
  const handleManagerChange = (value: string) => {
    if (form?.setValue) {
      if (value === 'none') {
        form.setValue('managerId', '');
      } else {
        form.setValue('managerId', value);
      }
    }
  };
  
  return (
    <div className="space-y-4">
      {form && showManagerOption && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="managerSelect" className="text-right">
            Responsable
          </Label>
          <div className="col-span-3">
            <Select
              onValueChange={handleManagerChange}
              value={form.getValues ? (form.getValues('managerId') || 'none') : 'none'}
              disabled={isLoadingEmployees}
            >
              <SelectTrigger id="managerSelect">
                <SelectValue placeholder={isLoadingEmployees ? "Chargement..." : "Sélectionner un responsable"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-popover">
                <SelectItem value="none">Aucun responsable</SelectItem>
                {Array.isArray(sortedEmployees) && sortedEmployees.map((employee) => (
                  employee && employee.id ? (
                    <SelectItem key={employee.id} value={employee.id}>
                      {`${employee.lastName || ''} ${employee.firstName || ''}`}
                    </SelectItem>
                  ) : null
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
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
