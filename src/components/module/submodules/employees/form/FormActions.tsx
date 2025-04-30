
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from './employeeFormSchema';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
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
  const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);
  
  // Ensure employees is always an array even if undefined
  useEffect(() => {
    // Guard against undefined or non-array employees
    if (employees && Array.isArray(employees)) {
      // Show all employees, no manager filtering
      const allEmployees = [...employees];
      
      // Sort employees by name and surname
      const sorted = allEmployees.sort((a, b) => {
        // Safely handle potentially undefined lastName/firstName
        const nameA = `${a?.lastName || ''} ${a?.firstName || ''}`.toLowerCase();
        const nameB = `${b?.lastName || ''} ${b?.firstName || ''}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      // Filter out employees without valid IDs
      const validEmployees = sorted.filter(emp => emp && emp.id);
      
      setSortedEmployees(validEmployees);
      
      // Update form values if form is available
      if (form) {
        const position = form.getValues('position');
        const forceManager = form.getValues('forceManager');
        
        if (position && !forceManager) {
          const shouldBeManager = isEmployeeManager(position);
          if (shouldBeManager) {
            form.setValue('forceManager', true);
          }
        }
      }
    } else {
      setSortedEmployees([]);
    }
  }, [employees, isLoadingEmployees, form]);
  
  return (
    <div className="space-y-4">
      {form && showManagerOption && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="managerSelect" className="text-right">
            Responsable
          </Label>
          <div className="col-span-3">
            <Select
              onValueChange={(value) => {
                if (value === 'none') {
                  form.setValue('managerId', '');
                } else {
                  form.setValue('managerId', value);
                }
              }}
              value={form.getValues('managerId') || 'none'}
              disabled={isLoadingEmployees}
            >
              <SelectTrigger id="managerSelect">
                <SelectValue placeholder={isLoadingEmployees ? "Chargement..." : "Sélectionner un responsable"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-popover">
                <SelectItem value="none">Aucun responsable</SelectItem>
                {sortedEmployees.map((employee) => {
                  // Ensure we only render SelectItems with valid (non-empty) values
                  if (!employee?.id) return null;
                  
                  const displayName = `${employee?.lastName || ''} ${employee?.firstName || ''}`.trim();
                  // Only render if we have a valid employee ID and name
                  if (!employee.id || !displayName) return null;
                  
                  return (
                    <SelectItem 
                      key={employee.id} 
                      value={employee.id}
                    >
                      {displayName || 'Employé sans nom'}
                    </SelectItem>
                  );
                })}
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
