
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building, Building2, Briefcase } from 'lucide-react';
import { EmployeeFormValues } from './employeeFormSchema';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';

interface CompanyDepartmentFieldsProps {
  disabledFields?: string[];
}

const CompanyDepartmentFields: React.FC<CompanyDepartmentFieldsProps> = ({ 
  disabledFields = [] 
}) => {
  // Safely access form context - this will throw a helpful error if used outside FormProvider
  const form = useFormContext<EmployeeFormValues>();
  const { departments = [], isLoading = false } = useAvailableDepartments();

  // If we don't have form context, render nothing or a fallback
  if (!form) {
    console.error('CompanyDepartmentFields must be used within a FormProvider');
    return null;
  }

  // Ensure departments is always an array
  const safeDepartments = Array.isArray(departments) ? departments : [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Entreprise
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Nom de l'entreprise" 
                  {...field} 
                  disabled={disabledFields.includes('company')}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Poste
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Intitulé du poste" 
                  {...field} 
                  disabled={disabledFields.includes('position')}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Département
              </FormLabel>
              <Select 
                onValueChange={field.onChange}
                value={field.value || "no_department"}
                disabled={disabledFields.includes('department')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no_department">Aucun département</SelectItem>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : (
                    safeDepartments.length > 0 ? 
                    safeDepartments.map((dept) => (
                      <SelectItem 
                        key={dept.id || `dept-${Math.random()}`} 
                        value={dept.id || `dept-${Math.random()}`}
                      >
                        {dept.name || "Département sans nom"}
                      </SelectItem>
                    )) :
                    <SelectItem value="no_departments_available" disabled>Aucun département disponible</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CompanyDepartmentFields;
