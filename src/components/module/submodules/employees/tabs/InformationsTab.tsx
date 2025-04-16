
import React from 'react';
import { Employee } from '@/types/employee';
import { UseFormReturn } from 'react-hook-form';
import { EmployeeFormValues } from '../form/employeeFormSchema';
import PersonalInformation from '../profile/PersonalInformation';
import ProfessionalInformation from '../profile/ProfessionalInformation';
import ManagerCheckbox from '../form/ManagerCheckbox';

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
  return (
    <div className="space-y-6">
      <PersonalInformation employee={employee} />
      <ProfessionalInformation 
        employee={employee} 
        showManagerOption={showManagerOption} 
      />
      
      {form && showManagerOption && (
        <div className="mt-4">
          <ManagerCheckbox form={form} />
        </div>
      )}
    </div>
  );
};

export default InformationsTab;
