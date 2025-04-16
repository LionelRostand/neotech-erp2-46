
import React from 'react';
import { Employee } from '@/types/employee';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../form/employeeFormSchema';
import PersonalInformation from '../profile/PersonalInformation';
import ProfessionalInformation from '../profile/ProfessionalInformation';
import ManagerCheckbox from '../form/ManagerCheckbox';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

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
  if (!isEditing) {
    return (
      <div className="space-y-6">
        <PersonalInformation employee={employee} />
        <ProfessionalInformation 
          employee={employee} 
          showManagerOption={showManagerOption} 
        />
      </div>
    );
  }

  // Check if form exists before rendering the edit form
  if (!form) {
    console.error('Form object is undefined in InformationsTab while in editing mode');
    return (
      <div className="p-4 bg-red-50 text-red-500 rounded-md">
        Error: Form configuration is missing. Please try again.
      </div>
    );
  }

  return (
    <Form {...form}>
      <form className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Prénom</label>
                <Input {...form.register('firstName')} defaultValue={employee.firstName} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom</label>
                <Input {...form.register('lastName')} defaultValue={employee.lastName} />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input {...form.register('email')} defaultValue={employee.email} type="email" />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input {...form.register('phone')} defaultValue={employee.phone} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Poste</label>
              <Input {...form.register('position')} defaultValue={employee.position} />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Département</label>
              <Input {...form.register('department')} defaultValue={employee.department} />
            </div>
          </div>
        </Card>

        {showManagerOption && (
          <div className="mt-4">
            <ManagerCheckbox form={form} />
          </div>
        )}
      </form>
    </Form>
  );
};

export default InformationsTab;
