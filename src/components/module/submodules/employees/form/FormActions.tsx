
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

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  form?: UseFormReturn<EmployeeFormValues>;
  showManagerOption?: boolean;
  error?: Error | null; // Added error property as optional
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isSubmitting = false,
  form,
  showManagerOption = true,
  error // Added error parameter
}) => {
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();
  const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);
  
  // Utiliser les données des employés dédupliquées depuis useEmployeeData
  useEffect(() => {
    if (employees && employees.length > 0) {
      console.log(`FormActions: Nombre total d'employés récupérés: ${employees.length}`);
      
      // Vérification des IDs pour s'assurer qu'il n'y a pas de doublons
      const uniqueIds = new Set(employees.map(emp => emp.id));
      console.log(`FormActions: Nombre d'IDs uniques: ${uniqueIds.size}`);
      
      // Tri des employés par nom de famille puis prénom pour faciliter la recherche
      // Filtrer seulement les employés qui sont des managers
      const managerEmployees = employees.filter(emp => 
        emp.isManager || isEmployeeManager(emp.position || '') || isEmployeeManager(emp.role || '')
      );
      
      const sorted = [...managerEmployees].sort((a, b) => {
        const nameA = `${a.lastName || ''} ${a.firstName || ''}`.toLowerCase();
        const nameB = `${b.lastName || ''} ${b.firstName || ''}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      console.log(`FormActions: Nombre de managers disponibles: ${sorted.length}`);
      
      setSortedEmployees(sorted);
      
      // Si le formulaire est disponible et qu'un employé actuel est édité,
      // mettre à jour le champ isManager basé sur le poste
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
      console.log('FormActions: Aucun employé récupéré ou liste vide');
      if (isLoadingEmployees) {
        console.log('FormActions: Chargement des employés en cours...');
      }
    }
  }, [employees, isLoadingEmployees, form]);
  
  return (
    <div className="space-y-4">
      {form && showManagerOption && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="managerId" className="text-right">
            Responsable
          </Label>
          <div className="col-span-3">
            <Select
              value={form.getValues('managerId') || 'none'}
              onValueChange={(value) => form.setValue('managerId', value === 'none' ? '' : value)}
              disabled={isLoadingEmployees}
            >
              <SelectTrigger>
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
