
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { EmployeeFormValues } from './employeeFormSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CompanyDepartmentFields = () => {
  const { register, formState: { errors }, setValue, watch } = useFormContext<EmployeeFormValues>();
  const { departments = [] } = useEmployeeData();
  const contractTypes = ['cdi', 'cdd', 'stage', 'alternance', 'freelance', 'autre'];
  
  // Liste fictive d'entreprises (à remplacer par des données réelles)
  const companies = [
    { id: 'company1', name: 'Entreprise A' },
    { id: 'company2', name: 'Entreprise B' },
    { id: 'company3', name: 'Entreprise C' },
  ];
  
  const watchDepartment = watch('department');
  const watchCompany = watch('company');

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Informations professionnelles</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Poste */}
        <div>
          <Label htmlFor="position">Poste</Label>
          <Input 
            id="position" 
            placeholder="Poste" 
            {...register('position')} 
          />
        </div>
        
        {/* Email professionnel */}
        <div>
          <Label htmlFor="professionalEmail">Email professionnel</Label>
          <Input 
            id="professionalEmail" 
            type="email" 
            placeholder="pro@exemple.com" 
            {...register('professionalEmail')} 
            className={errors.professionalEmail ? 'border-red-500' : ''}
          />
          {errors.professionalEmail && (
            <p className="text-red-500 text-xs mt-1">{errors.professionalEmail.message}</p>
          )}
        </div>
        
        {/* Type de contrat */}
        <div>
          <Label htmlFor="contract">Type de contrat</Label>
          <Select 
            defaultValue={watch('contract')}
            onValueChange={(value) => setValue('contract', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un type de contrat" />
            </SelectTrigger>
            <SelectContent>
              {contractTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Date d'embauche */}
        <div>
          <Label htmlFor="hireDate">Date d'embauche</Label>
          <Input 
            id="hireDate" 
            type="date" 
            {...register('hireDate')} 
          />
        </div>
        
        {/* Département */}
        <div>
          <Label htmlFor="department">Département</Label>
          <Select 
            value={watchDepartment}
            onValueChange={(value) => setValue('department', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un département" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Entreprise */}
        <div>
          <Label htmlFor="company">Entreprise</Label>
          <Select 
            value={watchCompany}
            onValueChange={(value) => setValue('company', value)}
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
        </div>
      </div>
    </div>
  );
};

export default CompanyDepartmentFields;
