
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Employee } from '@/types/employee';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, EmployeeFormValues } from './form/employeeFormSchema';
import { Form } from '@/components/ui/form';
import PersonalInfoFields from './form/PersonalInfoFields';
import FormActions from './form/FormActions';
import { formToEmployee, employeeToForm } from './form/employeeUtils';
import PhotoUploadField from './form/PhotoUploadField';
import ManagerCheckbox from './form/ManagerCheckbox';

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Employee>) => Promise<void>;
  employee?: Employee;
  isEditing?: boolean;
}

const EmployeeFormDialog: React.FC<EmployeeFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  employee,
  isEditing = false
}) => {
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: employee ? employeeToForm(employee) : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      company: '',
      status: 'active',
      contract: 'cdi',
      isManager: false,
      forceManager: false
    }
  });

  const handleSubmit = async (formData: EmployeeFormValues) => {
    try {
      const employeeData = formToEmployee(formData, employee);
      await onSubmit(employeeData);
      form.reset();
    } catch (error) {
      console.error('Error submitting employee form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier un employé' : 'Ajouter un employé'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <PhotoUploadField form={form} />
                <PersonalInfoFields form={form} />
              </div>
              
              <div className="space-y-6">
                <ManagerCheckbox form={form} />
              </div>
            </div>

            <FormActions 
              onCancel={() => onOpenChange(false)} 
              isSubmitting={form.formState.isSubmitting}
              form={form}
              error={null}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeFormDialog;
