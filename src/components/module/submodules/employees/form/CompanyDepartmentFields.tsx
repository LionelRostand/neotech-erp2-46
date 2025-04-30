
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useCompaniesData } from '@/hooks/useCompaniesData';

const CompanyDepartmentFields = () => {
  const { control } = useFormContext();
  const { companies, isLoading: isLoadingCompanies } = useCompaniesData();

  // Ensure companies is always an array
  const safeCompanies = companies || [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations professionnelles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entreprise</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ""}
                disabled={isLoadingCompanies}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={isLoadingCompanies ? "Chargement..." : "Sélectionner une entreprise"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {/* Default "No company" option */}
                  <SelectItem value="">Aucune entreprise</SelectItem>
                  
                  {/* Companies from the companies module */}
                  {safeCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name || "Entreprise sans nom"}
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
                <Input placeholder="Département" {...field} value={field.value || ""} />
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
                <Input placeholder="Poste" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="professionalEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email professionnel</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email professionnel" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CompanyDepartmentFields;
