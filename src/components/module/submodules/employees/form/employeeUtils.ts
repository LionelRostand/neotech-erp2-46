
import { Employee } from '@/types/employee';
import { EmployeeFormValues } from './employeeFormSchema';

export const prepareEmployeeData = (data: EmployeeFormValues): Partial<Employee> => {
  return {
    ...data,
    id: `EMP${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
    education: [],
    skills: [],
    documents: [],
    workSchedule: {
      monday: '09:00 - 18:00',
      tuesday: '09:00 - 18:00',
      wednesday: '09:00 - 18:00',
      thursday: '09:00 - 18:00',
      friday: '09:00 - 17:00',
    },
  };
};
