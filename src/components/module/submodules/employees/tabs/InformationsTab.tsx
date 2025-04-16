
import React from 'react';
import { Employee } from '@/types/employee';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../form/employeeFormSchema';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InformationsTabProps {
  employee: Employee;
  isEditing?: boolean;
  onFinishEditing?: () => void;
  form?: UseFormReturn<EmployeeFormValues>;
  showManagerOption?: boolean;
}

const InformationsTab: React.FC<InformationsTabProps> = ({ 
  employee, 
  isEditing = false,
  form,
  showManagerOption = true
}) => {
  // Check if form exists when in editing mode
  if (isEditing && !form) {
    console.error('Form object is undefined in InformationsTab while in editing mode');
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error: Form configuration is missing. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <Form {...(form || {})}>
          <form className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Prénom</label>
                  {isEditing ? (
                    <Input {...form?.register('firstName')} defaultValue={employee.firstName} />
                  ) : (
                    <div className="p-2 border rounded-md bg-muted/10">{employee.firstName}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  {isEditing ? (
                    <Input {...form?.register('lastName')} defaultValue={employee.lastName} />
                  ) : (
                    <div className="p-2 border rounded-md bg-muted/10">{employee.lastName}</div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                {isEditing ? (
                  <Input {...form?.register('email')} defaultValue={employee.email} type="email" />
                ) : (
                  <div className="p-2 border rounded-md bg-muted/10">{employee.email}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Téléphone</label>
                {isEditing ? (
                  <Input {...form?.register('phone')} defaultValue={employee.phone} />
                ) : (
                  <div className="p-2 border rounded-md bg-muted/10">{employee.phone || '-'}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Poste</label>
                {isEditing ? (
                  <Input {...form?.register('position')} defaultValue={employee.position} />
                ) : (
                  <div className="p-2 border rounded-md bg-muted/10">{employee.position || '-'}</div>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Département</label>
                {isEditing ? (
                  <Input {...form?.register('department')} defaultValue={employee.department} />
                ) : (
                  <div className="p-2 border rounded-md bg-muted/10">{employee.department || '-'}</div>
                )}
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default InformationsTab;
