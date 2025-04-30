
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useEmployeeData } from '@/hooks/useEmployeeData';
import { EmployeeFormValues } from './employeeFormSchema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CompanyDepartmentFields = () => {
  const { register, formState: { errors }, setValue, watch } = useFormContext<EmployeeFormValues>();
  const { departments, employees = [] } = useEmployeeData();
  const contractTypes = ['cdi', 'cdd', 'stage', 'alternance', 'freelance', 'autre'];
  
  // Liste fictive d'entreprises (à remplacer par des données réelles)
  const companies = [
    { id: 'company1', name: 'Entreprise A' },
    { id: 'company2', name: 'Entreprise B' },
    { id: 'company3', name: 'Entreprise C' },
  ];
  
  const watchDepartment = watch('department');
  const watchCompany = watch('company');
  const watchManagerId = watch('managerId');

  // Liste des employés pouvant être responsables
  const potentialManagers = employees
    .filter(emp => emp.isManager || (emp.position && emp.position.toLowerCase().includes('manager')))
    .map(emp => ({
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`
    }));

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
            defaultValue={watch('contract') || 'cdi'}
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
            value={watchDepartment || 'no-department'}
            onValueChange={(value) => {
              if (value === 'no-department') {
                setValue('department', '');
              } else {
                setValue('department', value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un département" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-department">Aucun département</SelectItem>
              {departments && departments.length > 0 && departments.map((dept) => (
                dept && dept.id ? (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name || `Département ${dept.id.substring(0, 5)}`}
                  </SelectItem>
                ) : null
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Entreprise */}
        <div>
          <Label htmlFor="company">Entreprise</Label>
          <Select 
            value={watchCompany || 'no-company'}
            onValueChange={(value) => {
              if (value === 'no-company') {
                setValue('company', '');
              } else {
                setValue('company', value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une entreprise" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-company">Aucune entreprise</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Responsable */}
        <div className="md:col-span-2">
          <Label htmlFor="managerId">Responsable</Label>
          <Select 
            value={watchManagerId || 'no-manager'}
            onValueChange={(value) => {
              if (value === 'no-manager') {
                setValue('managerId', '');
              } else {
                setValue('managerId', value);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un responsable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-manager">Aucun responsable</SelectItem>
              {potentialManagers.map((manager) => (
                manager && manager.id ? (
                  <SelectItem key={manager.id} value={manager.id}>
                    {manager.name}
                  </SelectItem>
                ) : null
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CompanyDepartmentFields;
