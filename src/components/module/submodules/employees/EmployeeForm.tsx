
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, EmployeeFormValues } from './form/employeeFormSchema';
import PersonalInfoFields from './form/PersonalInfoFields';
import CompanyDepartmentFields from './form/CompanyDepartmentFields';
import FormActions from './form/FormActions';
import PhotoUploadField from './form/PhotoUploadField';
import { Employee } from '@/types/employee';
import { getPhotoUrl } from './utils/photoUtils';
import { employeeToFormValues } from './utils/formAdapter';

interface EmployeeFormProps {
  defaultValues?: Partial<Employee>;
  onSubmit: (data: EmployeeFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false
}) => {
  const formDefaultValues = defaultValues ? 
    employeeToFormValues(defaultValues) : 
    {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      department: '',
      position: '',
      contract: 'cdi',
      hireDate: new Date().toISOString().split('T')[0],
      birthDate: '',
      status: 'active' as const,
      photo: '',
      photoMeta: undefined,
      forceManager: false,
      isManager: false,
      managerId: '',
      professionalEmail: '',
      streetNumber: '',
      streetName: '',
      city: '',
      zipCode: '',
      region: '',
      country: 'France'
    };

  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: formDefaultValues
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <PhotoUploadField 
          defaultPhotoUrl={defaultValues?.photoURL || defaultValues?.photo || getPhotoUrl(defaultValues?.photoMeta) || ''} 
        />
        <PersonalInfoFields />
        <CompanyDepartmentFields />
        <FormActions 
          onCancel={onCancel} 
          isSubmitting={isSubmitting} 
          form={methods}
          showManagerOption={true}
        />
      </form>
    </FormProvider>
  );
};

export default EmployeeForm;
