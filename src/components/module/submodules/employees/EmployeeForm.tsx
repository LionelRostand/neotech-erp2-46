
import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form } from '@/components/ui/form';
import { Employee } from '@/types/employee';
import PersonalInfoFields from './form/PersonalInfoFields';
import EmploymentInfoFields from './form/EmploymentInfoFields';
import FormActions from './form/FormActions';
import AccountCreationSection from './form/AccountCreationSection';
import { useEmployeeForm } from './form/useEmployeeForm';

interface EmployeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Employee>) => void;
  employee?: Employee;
  isEditing?: boolean;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ 
  open, 
  onOpenChange, 
  onSubmit, 
  employee, 
  isEditing = false 
}) => {
  const {
    form,
    createAccount,
    setCreateAccount,
    isSubmitting,
    handleSubmit,
    generateProfessionalEmail
  } = useEmployeeForm({
    employee,
    isEditing,
    onSubmit,
    onClose: () => onOpenChange(false)
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:max-w-md overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{isEditing ? 'Modifier un employé' : 'Ajouter un nouvel employé'}</SheetTitle>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <PersonalInfoFields />
            <EmploymentInfoFields />
            
            {!isEditing && (
              <AccountCreationSection
                form={form}
                createAccount={createAccount}
                onCreateAccountChange={setCreateAccount}
                generateProfessionalEmail={generateProfessionalEmail}
              />
            )}
            
            <FormActions 
              onCancel={() => onOpenChange(false)} 
              isSubmitting={isSubmitting} 
            />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeForm;
