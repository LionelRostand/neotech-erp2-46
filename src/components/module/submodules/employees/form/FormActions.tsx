
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
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();
  const { departments, isLoading: isLoadingDepartments } = useFirebaseDepartments();
  const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);
  
  // Utiliser les données des employés dédupliquées depuis useEmployeeData
  useEffect(() => {
    if (employees && employees.length > 0) {
      const managerEmployees = employees.filter(emp => 
        emp.isManager || isEmployeeManager(emp.position || '') || isEmployeeManager(emp.role || '')
      );
      
      const sorted = [...managerEmployees].sort((a, b) => {
        const nameA = `${a.lastName || ''} ${a.firstName || ''}`.toLowerCase();
        const nameB = `${b.lastName || ''} ${b.firstName || ''}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      setSortedEmployees(sorted);
      
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
    }
  }, [employees, isLoadingEmployees, form]);
  
  return (
    <div className="space-y-4">
      {form && (
        <>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Département
            </Label>
            <div className="col-span-3">
              <Select
                value={form.getValues('department') || ''}
                onValueChange={(value) => form.setValue('department', value)}
                disabled={isLoadingDepartments}
              >
                <SelectTrigger>
                  <SelectValue placeholder={isLoadingDepartments ? "Chargement..." : "Sélectionner un département"} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] overflow-y-auto bg-popover">
                  {departments?.map((department) => (
                    <SelectItem key={department.id} value={department.id}>
                      {department.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {showManagerOption && (
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
                    {sortedEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {`${employee.lastName || ''} ${employee.firstName || ''}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </>
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
