
import { Company } from '@/components/module/submodules/companies/types';

export interface EmployeeAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
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
  fileData?: string; // Base64 data for document
  fileHex?: string;  // Hexadecimal data for document
  fileType?: string; // MIME type of the document
  id?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: EmployeeAddress | string;
  department?: string;
  departmentId?: string;
  position?: string;
  hireDate?: string;
  startDate?: string;
  status: 'active' | 'inactive' | 'onLeave' | 'Actif' | string;
  contract?: string;
  manager?: string;
  managerId?: string;
  education?: Education[];
  skills?: string[];
  documents?: Document[] | string[];
  workSchedule?: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday?: string;
    sunday?: string;
  };
  payslips?: string[];
  birthDate?: string;
  socialSecurityNumber?: string;
  photo?: string;
  photoURL?: string;
  title?: string;
  role?: string;
  professionalEmail?: string;
  company?: string | Company;
}
