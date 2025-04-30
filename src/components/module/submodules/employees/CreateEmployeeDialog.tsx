
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeFormSchema, EmployeeFormValues } from './form/employeeFormSchema';
import { formValuesToEmployee } from './utils/formAdapter';
import { Employee } from '@/types/employee';
import PersonalInfoFields from './form/PersonalInfoFields';
import CompanyDepartmentFields from './form/CompanyDepartmentFields';

interface CreateEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (employee: Partial<Employee>) => void;
}

const CreateEmployeeDialog: React.FC<CreateEmployeeDialogProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      professionalEmail: '',
      department: '',
      company: '',
      status: 'active',
      contract: 'cdi',
      hireDate: new Date().toISOString().split('T')[0],
      forceManager: false,
      isManager: false
    },
    mode: 'onChange'
  });

  const handleSubmit = (data: EmployeeFormValues) => {
    const employeeData = formValuesToEmployee(data);
    onSubmit(employeeData);
    methods.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvel Employé</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
            <PersonalInfoFields />
            <CompanyDepartmentFields />
            
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => onOpenChange(false)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEmployeeDialog;
