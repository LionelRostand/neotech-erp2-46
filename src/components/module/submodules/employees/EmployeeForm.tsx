
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, EmployeeFormValues } from './form/employeeFormSchema';
import PersonalInfoFields from './form/PersonalInfoFields';
import CompanyDepartmentFields from './form/CompanyDepartmentFields';
import FormActions from './form/FormActions';
import PhotoUploadField from './form/PhotoUploadField';
import { Employee } from '@/types/employee';
import { processPhotoMetadata } from './utils/employeeUtils';
import { getPhotoUrl } from './utils/photoUtils';

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
  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: defaultValues?.firstName || '',
      lastName: defaultValues?.lastName || '',
      email: defaultValues?.email || '',
      phone: defaultValues?.phone || '',
      company: defaultValues?.company || '',
      department: defaultValues?.department || '',
      position: defaultValues?.position || '',
      contract: defaultValues?.contract || 'cdi',
      hireDate: defaultValues?.hireDate || new Date().toISOString().split('T')[0],
      birthDate: defaultValues?.birthDate || '',
      status: defaultValues?.status || 'active',
      photo: defaultValues?.photo || defaultValues?.photoURL || '',
      photoMeta: defaultValues?.photoMeta,
      forceManager: defaultValues?.forceManager || false,
      isManager: defaultValues?.isManager || false,
      managerId: defaultValues?.managerId || '',
      professionalEmail: defaultValues?.professionalEmail || '',
      streetNumber: defaultValues?.streetNumber || '',
      streetName: defaultValues?.streetName || '',
      city: defaultValues?.city || '',
      zipCode: defaultValues?.zipCode || '',
      region: defaultValues?.region || ''
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
        <PhotoUploadField 
          defaultPhotoUrl={getPhotoUrl(defaultValues?.photoMeta) || defaultValues?.photoURL || defaultValues?.photo || ''} 
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
