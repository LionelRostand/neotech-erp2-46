
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField, FormItem, FormLabel } from '@/components/ui/form';
import { EmployeeFormValues } from './employeeFormSchema';

const CompanyDepartmentFields = () => {
  const { control, watch, setValue } = useFormContext<EmployeeFormValues>();
  const { companies, isLoading: isLoadingCompanies } = useFirebaseCompanies();
  const { departments, isLoading: isLoadingDepartments } = useAvailableDepartments();
  const selectedCompany = watch('company');

  const filteredDepartments = departments.filter(
    dept => !selectedCompany || dept.id.startsWith(selectedCompany)
  );

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entreprise</FormLabel>
            <Select
              onValueChange={(val) => {
                field.onChange(val);
                // Reset department when company changes
                setValue('department', '');
              }}
              defaultValue={field.value}
              disabled={isLoadingCompanies}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une entreprise" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Département</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={isLoadingDepartments || !selectedCompany}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un département" />
              </SelectTrigger>
              <SelectContent>
                {filteredDepartments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyDepartmentFields;
