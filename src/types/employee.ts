
import { Company } from '@/components/module/submodules/companies/types';

export interface EmployeeAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
  streetNumber?: string;
  department?: string;
}

export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface Document {
  name: string;
  date: string;
  type: string;
  fileUrl?: string;
  id?: string;
}

export interface Employee {
  id: string;
  userId?: string; // Make userId optional for compatibility
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
  status: 'active' | 'inactive' | 'onLeave' | 'Actif';
  address: string | EmployeeAddress;
  contract: string;
  socialSecurityNumber: string;
  birthDate: string;
  documents: Document[] | any[];
  company: string | Company;
  role: string;
  title: string;
  manager: string;
  managerId: string;
  professionalEmail: string;
  skills: string[];
  education: Education[] | any[];
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
  createdAt?: Date;
  updatedAt?: Date;
}
