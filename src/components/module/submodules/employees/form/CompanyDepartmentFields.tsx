
import React, { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/patched-select';
import { Building, Building2, Briefcase } from 'lucide-react';
import { EmployeeFormValues } from './employeeFormSchema';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import { useCompaniesForSelect } from '../hooks/useCompaniesForSelect';

const CompanyDepartmentFields: React.FC = () => {
  const form = useFormContext<EmployeeFormValues>();
  const { departments, isLoading: departmentsLoading } = useAvailableDepartments();
  const { companies, isLoading: companiesLoading } = useCompaniesForSelect();
  
  // Memoize department items to prevent unnecessary re-renders
  const departmentItems = useMemo(() => {
    // Start with the "no department" option
    const items = [
      <SelectItem key="no_department" value="no_department">Aucun département</SelectItem>
    ];
    
    // Add a loading state if departments are still loading
    if (departmentsLoading) {
      items.push(<SelectItem key="loading" value="loading_departments" disabled>Chargement...</SelectItem>);
      return items;
    }
    
    // Add department options if available
    if (departments && departments.length > 0) {
      departments.forEach(dept => {
        if (dept && dept.id && dept.name) {
          items.push(
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
            </SelectItem>
          );
        }
      });
    }
    
    return items;
  }, [departments, departmentsLoading]);

  // Memoize company items to prevent unnecessary re-renders
  const companyItems = useMemo(() => {
    // Start with the "no company" option
    const items = [
      <SelectItem key="no_company" value="no_company">Sélectionner une entreprise</SelectItem>
    ];
    
    // Add a loading state if companies are still loading
    if (companiesLoading) {
      items.push(<SelectItem key="loading" value="loading_companies" disabled>Chargement...</SelectItem>);
      return items;
    }
    
    // Add company options if available
    if (companies && companies.length > 0) {
      companies.forEach(company => {
        if (company && company.id && company.name) {
          items.push(
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          );
        }
      });
    }
    
    return items;
  }, [companies, companiesLoading]);

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
                onValueChange={field.onChange}
                value={field.value || "no_company"}
                disabled={companiesLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {companyItems}
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
                <Input placeholder="Intitulé du poste" {...field} />
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
                disabled={departmentsLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {departmentItems}
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
