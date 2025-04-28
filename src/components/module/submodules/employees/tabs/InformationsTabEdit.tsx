
import React from 'react';
import { Employee } from '@/types/employee';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, EmployeeFormValues } from '../form/employeeFormSchema';
import CompanyDepartmentFields from '../form/CompanyDepartmentFields';
import { formValuesToEmployee, employeeToFormValues } from '../utils/formAdapter';
import PersonalInfoFields from '../form/PersonalInfoFields';

interface InformationsTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
}

const InformationsTabEdit: React.FC<InformationsTabEditProps> = ({ employee, onSave }) => {
  const defaultValues = employeeToFormValues(employee);
  
  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues
  });
  
  const handleSubmit = (data: EmployeeFormValues) => {
    const updatedEmployeeData = formValuesToEmployee(data, employee);
    onSave(updatedEmployeeData);
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoFields />
        <CompanyDepartmentFields />
        
        <div className="flex justify-end">
          <button 
            type="submit" 
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default InformationsTabEdit;
