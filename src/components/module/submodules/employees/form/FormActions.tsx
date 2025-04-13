
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

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
  form?: UseFormReturn<EmployeeFormValues>;
  showManagerOption?: boolean;
}

const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  isSubmitting = false,
  form,
  showManagerOption = true
}) => {
  const { employees, isLoading: isLoadingEmployees } = useEmployeeData();
  const [sortedEmployees, setSortedEmployees] = useState<Employee[]>([]);
  
  // Utiliser les données des employés dédupliquées depuis useEmployeeData
  useEffect(() => {
    if (employees && employees.length > 0) {
      console.log(`FormActions: Nombre total d'employés récupérés après déduplication: ${employees.length}`);
      
      // Vérification des IDs pour s'assurer qu'il n'y a pas de doublons
      const uniqueIds = new Set(employees.map(emp => emp.id));
      console.log(`FormActions: Nombre d'IDs uniques: ${uniqueIds.size}`);
      
      // Tri des employés par nom de famille puis prénom pour faciliter la recherche
      const sorted = [...employees].sort((a, b) => {
        const nameA = `${a.lastName || ''} ${a.firstName || ''}`.toLowerCase();
        const nameB = `${b.lastName || ''} ${b.firstName || ''}`.toLowerCase();
        return nameA.localeCompare(nameB);
      });
      
      // Vérification de la présence de LIONEL DJOSSA pour le débogage
      const lionelDjossa = sorted.find(
        emp => emp.firstName?.toLowerCase().includes('lionel') && 
               emp.lastName?.toLowerCase().includes('djossa')
      );
      
      if (lionelDjossa) {
        console.log('FormActions: LIONEL DJOSSA est présent dans la liste triée:');
        console.log({
          id: lionelDjossa.id,
          nom: `${lionelDjossa.lastName} ${lionelDjossa.firstName}`,
          status: lionelDjossa.status
        });
      } else {
        console.log('FormActions: LIONEL DJOSSA n\'est pas trouvé dans la liste triée');
      }
      
      setSortedEmployees(sorted);
    } else {
      console.log('FormActions: Aucun employé récupéré ou liste vide');
      if (isLoadingEmployees) {
        console.log('FormActions: Chargement des employés en cours...');
      }
    }
  }, [employees, isLoadingEmployees]);
  
  return (
    <div className="space-y-4">
      {form && showManagerOption && (
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="managerId" className="text-right">
            Responsable
          </Label>
          <div className="col-span-3">
            <Select
              value={form.getValues('managerId') || ''}
              onValueChange={(value) => form.setValue('managerId', value)}
              disabled={isLoadingEmployees}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoadingEmployees ? "Chargement..." : "Sélectionner un responsable"} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-popover">
                <SelectItem value="">Aucun responsable</SelectItem>
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
