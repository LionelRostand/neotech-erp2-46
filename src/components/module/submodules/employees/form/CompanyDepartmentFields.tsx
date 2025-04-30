
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

const CompanyDepartmentFields: React.FC = () => {
  const form = useFormContext<EmployeeFormValues>();
  const { departments } = useAvailableDepartments();

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
                <Input placeholder="Nom de l'entreprise" {...field} />
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
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no_department">Aucun département</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
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
