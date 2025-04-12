
import { Company } from '@/components/module/submodules/companies/types';

export interface EmployeeAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
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
  employeeId?: string; // ID de l'employé associé
  filePath?: string;  // Chemin dans Firebase Storage
  fileSize?: number;  // Taille du fichier
  storedInFirebase?: boolean; // Indique si stocké dans Firebase
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
  photoData?: string; // Base64 data for the photo
  photoHex?: string;  // Hexadecimal data for the photo
  photoMeta?: {
    fileName: string;
    fileType: string;
    fileSize: number;
    updatedAt: string;
  };
  hireDate: string;
  startDate: string;
  status: 'active' | 'inactive' | 'onLeave' | 'Actif' | 'En congé' | 'Suspendu' | 'Inactif';
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
  createdAt?: string; // Adding timestamp for creation date
  updatedAt?: string; // Adding timestamp for last update
}
