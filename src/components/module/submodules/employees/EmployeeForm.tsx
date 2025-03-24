
import React, { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Form } from '@/components/ui/form';
import { Employee } from '@/types/employee';
import PersonalInfoFields from './form/PersonalInfoFields';
import EmploymentInfoFields from './form/EmploymentInfoFields';
import FormActions from './form/FormActions';
import { employeeFormSchema, EmployeeFormValues } from './form/employeeFormSchema';
import { prepareEmployeeData } from './form/employeeUtils';

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
  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      department: '',
      position: '',
      contract: 'CDI',
      hireDate: '',
      manager: '',
      status: 'Actif',
    },
  });

  // Si mode édition, charger les valeurs de l'employé
  useEffect(() => {
    if (isEditing && employee) {
      form.reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        address: employee.address,
        department: employee.department,
        position: employee.position,
        contract: employee.contract,
        hireDate: employee.hireDate,
        manager: employee.manager,
        status: employee.status,
      });
    } else {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        department: '',
        position: '',
        contract: 'CDI',
        hireDate: '',
        manager: '',
        status: 'Actif',
      });
    }
  }, [isEditing, employee, form, open]);

  const handleSubmit = (data: EmployeeFormValues) => {
    const employeeData = isEditing 
      ? data
      : prepareEmployeeData(data);
    
    onSubmit(employeeData);
    form.reset();
    onOpenChange(false);
  };

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
            <FormActions onCancel={() => onOpenChange(false)} />
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeForm;
