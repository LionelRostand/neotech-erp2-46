
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Employee } from '@/types/employee';
import { employeeFormSchema, EmployeeFormValues } from './form/employeeFormSchema';
import { formValuesToEmployee, employeeToFormValues } from './utils/formAdapter';
import PersonalInfoFields from './form/PersonalInfoFields';
import CompanyDepartmentFields from './form/CompanyDepartmentFields';
import FormActions from './form/FormActions';

interface EmployeeFormProps {
  onSubmit: (employee: Partial<Employee>) => void;
  onCancel: () => void;
  defaultValues?: Partial<Employee>;
  isSubmitting?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onSubmit,
  onCancel,
  defaultValues = {},
  isSubmitting = false
}) => {
  // Préparer les valeurs par défaut
  const initialValues = employeeToFormValues(defaultValues);
  
  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: initialValues,
    mode: 'onChange'
  });
  
  const handleSubmit = (data: EmployeeFormValues) => {
    // Convertir les données du formulaire en objet Employee
    const employeeData = formValuesToEmployee(data, defaultValues);
    onSubmit(employeeData);
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoFields />
        <CompanyDepartmentFields />
        
        <FormActions 
          onCancel={onCancel}
          isSubmitting={isSubmitting}
          form={methods}
        />
      </form>
    </FormProvider>
  );
};

export default EmployeeForm;
