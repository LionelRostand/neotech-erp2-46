import { Company } from '@/components/module/submodules/companies/types';

export interface EmployeeAddress {
  street: string;
  streetNumber?: string; // Added streetNumber property
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
  documentId?: string; // ID du document dans la collection hr_documents
  binaryData?: boolean; // Indique si les données sont stockées sous format binaire
  storedInHrDocuments?: boolean; // Indique si stocké dans hr_documents
  storageFormat?: 'base64' | 'binary' | 'hex'; // Format de stockage des données
  base64Data?: string; // Données au format base64
}

export interface LeaveRequest {
  id: string;
  startDate: string;
  endDate: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected' | 'En attente' | 'Approuvé' | 'Refusé';
  comments?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface Evaluation {
  id: string;
  date: string;
  title?: string;
  rating?: number;
  comments?: string;
  evaluator?: string;
  evaluatorId?: string;
  evaluatorName?: string;
  employeeId?: string;
  status?: 'Planifiée' | 'Complétée' | 'Annulée';
  score?: number;
  maxScore?: number;
  department?: string;
  goals?: string[];
  strengths?: string[];
  improvements?: string[];
  fromEmployeeRecord?: boolean;
}

export interface Employee {
  id: string;
  firebaseId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  departmentId: string;
  photo: string;
  photoURL: string;
  photoData?: string;
  photoHex?: string;
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
  address_string?: string;
  createdAt?: string;
  updatedAt?: string;
  leaveRequests?: LeaveRequest[];
  evaluations?: Evaluation[];
  isManager?: boolean;
  forceManager?: boolean;
  salary?: number;
  badgeNumber?: string;
  conges?: {
    acquired: number;
    taken: number;
    balance: number;
  };
  rtt?: {
    acquired: number;
    taken: number;
    balance: number;
  };
}
