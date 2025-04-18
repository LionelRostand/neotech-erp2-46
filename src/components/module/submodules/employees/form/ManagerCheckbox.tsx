
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { EmployeeFormValues } from './employeeFormSchema';

interface ManagerCheckboxProps {
  form: UseFormReturn<EmployeeFormValues>;
}

const ManagerCheckbox: React.FC<ManagerCheckboxProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="isManager"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Est manager</FormLabel>
              <FormDescription>
                Définit cet employé comme manager, lui permettant de gérer une équipe
              </FormDescription>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="forceManager"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>Forcer le statut de manager</FormLabel>
              <FormDescription>
                Force l'enregistrement dans la collection des managers,
                indépendamment du poste occupé
              </FormDescription>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ManagerCheckbox;
