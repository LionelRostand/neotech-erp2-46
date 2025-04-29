
import React, { useState, useEffect } from 'react';
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
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';

interface CompanyDepartmentFieldsProps {
  disabledFields?: string[];
}

const CompanyDepartmentFields: React.FC<CompanyDepartmentFieldsProps> = ({ 
  disabledFields = [] 
}) => {
  // Safely access form context - this will throw a helpful error if used outside FormProvider
  const form = useFormContext<EmployeeFormValues>();
  const { companies = [], isLoading: isLoadingCompanies } = useFirebaseCompanies();
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const { departments = [], isLoading: isLoadingDepartments, refetch } = useAvailableDepartments(selectedCompanyId);

  // If we don't have form context, render nothing or a fallback
  if (!form) {
    console.error('CompanyDepartmentFields must be used within a FormProvider');
    return null;
  }

  // Update selectedCompanyId when the form's company value changes
  useEffect(() => {
    const companyValue = form.watch('company');
    if (companyValue && companyValue !== selectedCompanyId) {
      setSelectedCompanyId(companyValue);
    }
  }, [form.watch('company')]);

  // When company selection changes, reset the department field if needed
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    form.setValue('company', companyId);
    
    // Reset department if it's not available in the new company
    const currentDept = form.getValues('department');
    if (currentDept && currentDept !== 'no_department') {
      // Check if the department is valid for the new company
      refetch().then(() => {
        const deptStillValid = departments.some(dept => dept.id === currentDept);
        if (!deptStillValid) {
          form.setValue('department', 'no_department');
        }
      });
    }
  };

  // Ensure companies is always an array
  const safeCompanies = Array.isArray(companies) ? companies : [];

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
              <Select 
                onValueChange={handleCompanyChange}
                value={field.value || ""}
                disabled={disabledFields.includes('company')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingCompanies ? (
                    <SelectItem value="loading" disabled>Chargement...</SelectItem>
                  ) : (
                    safeCompanies.length > 0 ? 
                    safeCompanies.map((company) => (
                      <SelectItem 
                        key={company.id || `company-${Math.random()}`} 
                        value={company.id || `company-${Math.random()}`}
                      >
                        {company.name || "Entreprise sans nom"}
                      </SelectItem>
                    )) :
                    <SelectItem value="no_companies_available" disabled>Aucune entreprise disponible</SelectItem>
                  )}
                </SelectContent>
              </Select>
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
                disabled={disabledFields.includes('department') || !selectedCompanyId}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no_department">Aucun département</SelectItem>
                  {isLoadingDepartments ? (
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
                    <SelectItem value="no_departments_available" disabled>Aucun département disponible pour cette entreprise</SelectItem>
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
