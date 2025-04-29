
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import { useCompaniesQuery } from '../hooks/useCompaniesQuery';
import { Building, MapPin, Landmark, Briefcase } from 'lucide-react';

const CompanyDepartmentFields = () => {
  const { register, setValue, watch } = useFormContext();
  const { departments, isLoading: isLoadingDepartments } = useAvailableDepartments();
  const { data: companies = [], isLoading: isLoadingCompanies } = useCompaniesQuery();
  
  // Set the department field to empty when company changes
  const selectedCompany = watch('company');
  
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="company">Entreprise</Label>
        <Select 
          onValueChange={(value) => setValue('company', value)}
          value={watch('company') || ''}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une entreprise" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingCompanies ? (
              <SelectItem value="loading" disabled>Chargement des entreprises...</SelectItem>
            ) : companies && companies.length > 0 ? (
              companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))
            ) : (
              <>
                <SelectItem value="none" disabled>Aucune entreprise disponible</SelectItem>
                <SelectItem value="main">Entreprise principale</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Département</Label>
        <Select 
          onValueChange={(value) => setValue('department', value)}
          value={watch('department') || ''}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un département" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingDepartments ? (
              <SelectItem value="loading" disabled>Chargement...</SelectItem>
            ) : !departments || departments.length === 0 ? (
              <SelectItem value="none" disabled>Aucun département disponible</SelectItem>
            ) : (
              departments.map((department) => (
                <SelectItem key={department.id} value={department.id}>
                  {department.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Poste</Label>
        <Input 
          id="position" 
          {...register('position')} 
          placeholder="Ex: Développeur Web"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="professionalEmail">Email professionnel</Label>
        <Input 
          id="professionalEmail" 
          {...register('professionalEmail')} 
          placeholder="email.professionnel@entreprise.com"
          type="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contract">Type de contrat</Label>
        <Select 
          onValueChange={(value) => setValue('contract', value)}
          value={watch('contract') || 'cdi'}
        >
          <SelectTrigger>
            <SelectValue placeholder="Type de contrat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cdi">CDI</SelectItem>
            <SelectItem value="cdd">CDD</SelectItem>
            <SelectItem value="interim">Intérim</SelectItem>
            <SelectItem value="stage">Stage</SelectItem>
            <SelectItem value="alternance">Alternance</SelectItem>
            <SelectItem value="freelance">Freelance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="hireDate">Date d'embauche</Label>
        <Input 
          id="hireDate" 
          type="date" 
          {...register('hireDate')}
        />
      </div>

      {/* Adresse professionnelle */}
      <div className="space-y-4 pt-3 border-t border-gray-200">
        <h3 className="text-sm font-medium">Adresse professionnelle</h3>
        
        <div className="space-y-2">
          <Label htmlFor="workAddress.street">Rue</Label>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input 
              id="workAddress.street" 
              {...register('workAddress.street')} 
              placeholder="123 Rue de l'entreprise"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="workAddress.city">Ville</Label>
            <div className="flex items-center">
              <Building className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input 
                id="workAddress.city" 
                {...register('workAddress.city')} 
                placeholder="Paris"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="workAddress.postalCode">Code postal</Label>
            <div className="flex items-center">
              <Landmark className="h-4 w-4 mr-2 text-muted-foreground" />
              <Input 
                id="workAddress.postalCode" 
                {...register('workAddress.postalCode')} 
                placeholder="75000"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="workAddress.country">Pays</Label>
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input 
              id="workAddress.country" 
              {...register('workAddress.country')} 
              placeholder="France"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyDepartmentFields;
