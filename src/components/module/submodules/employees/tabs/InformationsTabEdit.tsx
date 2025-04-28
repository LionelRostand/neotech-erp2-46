
import React from 'react';
import { Employee } from '@/types/employee';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, EmployeeFormValues } from '../form/employeeFormSchema';
import CompanyDepartmentFields from '../form/CompanyDepartmentFields';
import { formValuesToEmployee, employeeToFormValues } from '../utils/formAdapter';
import PersonalInfoFields from '../form/PersonalInfoFields';
import FormActions from '../form/FormActions';

interface InformationsTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
}

const InformationsTabEdit: React.FC<InformationsTabEditProps> = ({ employee, onSave }) => {
  // Ensure we have a valid employee object before creating form values
  const safeEmployee = employee || {};
  const defaultValues = employeeToFormValues(safeEmployee);
  
  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues,
    mode: 'onChange'
  });
  
  const handleSubmit = (data: EmployeeFormValues) => {
    console.log("Form submitted with values:", data);
    const updatedEmployeeData = formValuesToEmployee(data, employee);
    console.log("Converting to employee data:", updatedEmployeeData);
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
