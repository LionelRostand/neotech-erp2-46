
import { Company } from '@/components/module/submodules/companies/types';

export interface EmployeeAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  departmentId: string;
  photo: string;
  photoURL: string;
  hireDate: string;
  startDate: string;
  status: string;
  address: string | EmployeeAddress;
  contract: string;
  socialSecurityNumber: string;
  birthDate: string;
  documents: any[];
  company: string | Company;
  role: string;
  title: string;
  manager: string;
  managerId: string;
  professionalEmail: string;
  skills: string[];
  education: any[];
  workSchedule?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday?: string;
    sunday?: string;
  };
  payslips: any[];
  address_string?: string; // For backward compatibility
}
