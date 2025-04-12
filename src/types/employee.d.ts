import { Company } from '@/components/module/submodules/companies/types';

export interface EmployeeAddress {
  street?: string;
  city?: string;
  postalCode?: string;
  country?: string;
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
  documentId?: string; // ID du document dans la collection hr_documents
  binaryData?: boolean; // Indique si les données sont stockées sous format binaire
  storedInHrDocuments?: boolean; // Indique si stocké dans hr_documents
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
  status: 'active' | 'inactive' | 'onLeave' | 'Actif' | 'En congé' | 'Suspendu' | 'Inactif';
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
  photoData?: string;
  photoMeta?: {
    fileName: string;
    fileType: string;
    fileSize: number;
    updatedAt: string;
  };
  title?: string;
  role?: string;
  professionalEmail?: string;
  company?: string | Company;
  createdAt?: string; // Adding timestamp for creation date
  updatedAt?: string; // Adding timestamp for last update
}
