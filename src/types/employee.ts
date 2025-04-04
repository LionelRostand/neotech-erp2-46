
import { Company } from '@/components/module/submodules/companies/types';

export interface Document {
  name: string;
  date: string;
  type: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface WorkSchedule {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
}

export interface EmployeeAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position?: string;
  department?: string;
  departmentId?: string;
  photo?: string;
  photoURL?: string;
  hireDate?: string;
  startDate?: string;
  status?: 'active' | 'inactive' | 'onLeave' | 'Actif';
  address?: string | EmployeeAddress;
  contract?: string;
  socialSecurityNumber?: string;
  birthDate?: string;
  documents?: Document[] | string[];
  company?: string | Company;
  role?: string;
  title?: string;
  manager?: string;
  managerId?: string;
  professionalEmail?: string;
  skills?: string[];
  education?: Education[];
  workSchedule?: WorkSchedule;
  payslips?: string[];
}
