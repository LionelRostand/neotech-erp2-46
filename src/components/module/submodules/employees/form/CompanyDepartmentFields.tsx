
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { useCompaniesQuery } from '../hooks/useCompaniesQuery';

const CompanyDepartmentFields: React.FC = () => {
  const { control, watch } = useFormContext();
  const isManager = watch('isManager');
  const forceManager = watch('forceManager');
  
  // Récupérer la liste des entreprises
  const { data: companies = [], isLoading: isLoadingCompanies } = useCompaniesQuery();
  
  // Récupérer la liste des employés pour les managers
  const { employees = [], isLoading: isLoadingEmployees } = useEmployeeData();
  
  // Filtrer pour obtenir seulement les employés qui peuvent être managers
  const potentialManagers = employees.filter(employee => 
    employee.isManager || employee.status === 'active' || employee.status === 'Actif'
  );

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <h2 className="font-semibold text-lg">Informations professionnelles</h2>
      
      <FormField
        control={control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entreprise</FormLabel>
            <Select
              disabled={isLoadingCompanies}
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner une entreprise" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Département</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Département" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="position"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Poste</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Poste" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="contract"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type de contrat</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-1"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="cdi" />
                  </FormControl>
                  <FormLabel className="font-normal">CDI</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="cdd" />
                  </FormControl>
                  <FormLabel className="font-normal">CDD</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="interim" />
                  </FormControl>
                  <FormLabel className="font-normal">Intérim</FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="apprentissage" />
                  </FormControl>
                  <FormLabel className="font-normal">Apprentissage</FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="hireDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date d'embauche</FormLabel>
            <DatePicker 
              value={field.value ? new Date(field.value) : undefined}
              onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Statut</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="onLeave">En congé</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="isManager"
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isManager"
                checked={field.value || forceManager}
                onChange={(e) => field.onChange(e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
                disabled={forceManager}
              />
              <FormLabel htmlFor="isManager" className="font-normal cursor-pointer">
                Ce collaborateur est un manager
              </FormLabel>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {!isManager && !forceManager && (
        <FormField
          control={control}
          name="managerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsable</FormLabel>
              <Select
                disabled={isLoadingEmployees}
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionner un responsable" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="">Aucun responsable</SelectItem>
                  {potentialManagers.map((manager) => (
                    <SelectItem key={manager.id} value={manager.id}>
                      {manager.firstName} {manager.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Le responsable hiérarchique de cet employé
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default CompanyDepartmentFields;
