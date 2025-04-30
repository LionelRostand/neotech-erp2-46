
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EmployeeFormValues } from './employeeFormSchema';
import { DatePicker } from '@/components/ui/date-picker';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { useAvailableDepartments } from '@/hooks/useAvailableDepartments';
import { useCompaniesQuery } from '@/components/module/submodules/employees/hooks/useCompaniesQuery';
import { format } from 'date-fns';

const CompanyDepartmentFields = () => {
  const { register, setValue, getValues, watch } = useFormContext<EmployeeFormValues>();
  const { departments, isLoading: isLoadingDepartments } = useAvailableDepartments();
  const { data: companies = [], isLoading: isLoadingCompanies } = useCompaniesQuery();
  
  const hireDate = watch('hireDate');
  const contract = watch('contract');
  
  const handleCompanyChange = (value: string) => {
    setValue('company', value);
    setValue('department', ''); // Reset department when company changes
  };
  
  const handleDepartmentChange = (value: string) => {
    setValue('department', value);
  };
  
  const handleHireDateChange = (date: Date | undefined) => {
    if (date) {
      const dateString = format(date, 'yyyy-MM-dd');
      setValue('hireDate', dateString);
    }
  };
  
  useEffect(() => {
    // Set default hire date if not already set
    if (!getValues('hireDate')) {
      setValue('hireDate', format(new Date(), 'yyyy-MM-dd'));
    }
  }, [getValues, setValue]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Informations professionnelles</h3>
      
      {/* Company selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <Label htmlFor="company" className="md:text-right">
          Entreprise
        </Label>
        <div className="md:col-span-3">
          <Select 
            value={getValues('company') || 'default'} 
            onValueChange={handleCompanyChange}
            disabled={isLoadingCompanies}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une entreprise" />
            </SelectTrigger>
            <SelectContent>
              {/* Default option with a non-empty value */}
              <SelectItem value="default" disabled>
                Sélectionner une entreprise
              </SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id || 'company-id-missing'}>
                  {company.name || 'Entreprise sans nom'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Department selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <Label htmlFor="department" className="md:text-right">
          Département
        </Label>
        <div className="md:col-span-3">
          <Select 
            value={getValues('department') || 'default'} 
            onValueChange={handleDepartmentChange}
            disabled={isLoadingDepartments}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un département" />
            </SelectTrigger>
            <SelectContent>
              {/* Default option with a non-empty value */}
              <SelectItem value="default" disabled>
                Sélectionner un département
              </SelectItem>
              {departments
                .filter(dept => !getValues('company') || dept.companyId === getValues('company'))
                .map((department) => (
                  <SelectItem key={department.id} value={department.id || 'dept-id-missing'}>
                    {department.name || 'Département sans nom'}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Position */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <Label htmlFor="position" className="md:text-right">
          Poste
        </Label>
        <div className="md:col-span-3">
          <Input
            id="position"
            {...register('position')}
            placeholder="Ex: Développeur Full-Stack"
          />
        </div>
      </div>
      
      {/* Contract type */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <Label className="md:text-right">Type de contrat</Label>
        <div className="md:col-span-3">
          <RadioGroup
            defaultValue={getValues('contract') || "cdi"}
            className="flex flex-wrap gap-4"
            onValueChange={(value) => setValue('contract', value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cdi" id="cdi" />
              <Label htmlFor="cdi" className="cursor-pointer">CDI</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="cdd" id="cdd" />
              <Label htmlFor="cdd" className="cursor-pointer">CDD</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="internship" id="internship" />
              <Label htmlFor="internship" className="cursor-pointer">Stage</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="freelance" id="freelance" />
              <Label htmlFor="freelance" className="cursor-pointer">Freelance</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
      
      {/* Hire date */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <Label className="md:text-right">Date d'embauche</Label>
        <div className="md:col-span-3">
          <DatePicker 
            value={hireDate ? new Date(hireDate) : undefined} 
            onChange={handleHireDateChange}
          />
        </div>
      </div>
      
      {/* Professional Email */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <Label htmlFor="professionalEmail" className="md:text-right">
          Email professionnel
        </Label>
        <div className="md:col-span-3">
          <Input
            id="professionalEmail"
            {...register('professionalEmail')}
            type="email"
            placeholder="email.professionnel@entreprise.com"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDepartmentFields;
