
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
import { formValuesToEmployee, employeeToFormValues } from './utils/formAdapter';
import { Employee } from '@/types/employee';
import PersonalInfoFields from './form/PersonalInfoFields';
import CompanyDepartmentFields from './form/CompanyDepartmentFields';
import { Button } from '@/components/ui/button';

interface EditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee;
  onSubmit: (employee: Partial<Employee>) => void;
}

const EditEmployeeDialog: React.FC<EditEmployeeDialogProps> = ({
  open,
  onOpenChange,
  employee,
  onSubmit
}) => {
  const methods = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: employeeToFormValues(employee),
    mode: 'onChange'
  });

  const handleSubmit = (data: EmployeeFormValues) => {
    const updatedEmployee = formValuesToEmployee(data, employee);
    onSubmit(updatedEmployee);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier l'employé</DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="space-y-6">
            <PersonalInfoFields />
            <CompanyDepartmentFields />
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                onClick={() => onOpenChange(false)}
                variant="outline"
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
              >
                Mettre à jour
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeDialog;
