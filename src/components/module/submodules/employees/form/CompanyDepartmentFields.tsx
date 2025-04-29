
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Loader2, Building2, Users } from 'lucide-react';
import { useFirebaseCompanies } from '@/hooks/useFirebaseCompanies';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { EmployeeFormValues } from './employeeFormSchema';

const CompanyDepartmentFields: React.FC = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext<EmployeeFormValues>();
  const { companies, isLoading: isLoadingCompanies } = useFirebaseCompanies();
  
  // Surveiller la valeur du champ entreprise
  const selectedCompany = watch("company");
  
  // Utiliser le hook personnalisé pour obtenir les départements filtrés par entreprise
  const { departments, isLoading: isLoadingDepartments } = useAvailableDepartments(selectedCompany);
  
  // Réinitialiser le département si l'entreprise change
  useEffect(() => {
    if (selectedCompany) {
      setValue("department", "");
    }
  }, [selectedCompany, setValue]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entreprise</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoadingCompanies}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une entreprise" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {isLoadingCompanies ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Chargement...</span>
                    </div>
                  ) : companies?.length > 0 ? (
                    companies.map((company) => (
                      <SelectItem key={company.id} value={company.id} className="flex items-center">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                          {company.name}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>Aucune entreprise disponible</SelectItem>
                  )}
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
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isLoadingDepartments || !selectedCompany}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue 
                      placeholder={!selectedCompany 
                        ? "Sélectionnez d'abord une entreprise" 
                        : "Sélectionner un département"
                      } 
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-[300px] overflow-y-auto">
                  {isLoadingDepartments ? (
                    <div className="flex items-center justify-center p-2">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>Chargement...</span>
                    </div>
                  ) : !selectedCompany ? (
                    <SelectItem value="none" disabled>Sélectionnez d'abord une entreprise</SelectItem>
                  ) : departments?.length > 0 ? (
                    departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id} className="flex items-center">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          {dept.name}
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>Aucun département disponible pour cette entreprise</SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poste</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Ex: Développeur Web" />
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
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type de contrat" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cdi">CDI</SelectItem>
                  <SelectItem value="cdd">CDD</SelectItem>
                  <SelectItem value="interim">Intérim</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                  <SelectItem value="stage">Stage</SelectItem>
                  <SelectItem value="alternance">Alternance</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Statut</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="onLeave">En congé</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="hireDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'embauche</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
  
      <Separator />
  
      <div className="flex items-center space-x-2">
        <FormField
          control={control}
          name="forceManager"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="font-normal">
                Désigner comme responsable
              </FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CompanyDepartmentFields;
