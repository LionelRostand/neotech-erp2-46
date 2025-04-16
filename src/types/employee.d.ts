
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: EmployeeAddress | string;
  department?: string;
  departmentId?: string;
  position?: string;
  contract?: string;
  hireDate?: string;
  startDate?: string;
  endDate?: string;
  birthDate?: string;
  status?: 'active' | 'inactive' | 'onLeave' | 'Actif' | 'En congé' | 'Suspendu' | 'Inactif';
  salary?: number;
  manager?: string;
  managerId?: string;
  professionalEmail?: string;
  company?: string;
  companyId?: string;
  photoURL?: string;
  photo?: string;
  photoData?: string;
  photoMeta?: EmployeePhotoMeta;
  documents?: Document[];
  createdAt?: string;
  updatedAt?: string;
  socialSecurityNumber?: string;
  bannerColor?: string;
  skills?: string[];
  education?: EducationEntry[];
  workSchedule?: WorkSchedule;
  role?: string;
  isManager?: boolean; 
  userAccountId?: string;
  payslips?: string[];
  title?: string;
  forceManager?: boolean;
  badgeNumber?: string; // Added for employee badge
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

export interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  fileData?: string;
  fileType: string;
  fileSize: number; // Changed to number type to fix build errors
  employeeId: string;
  documentId?: string;
  storedInFirebase?: boolean;
  storedInHrDocuments?: boolean;
  storageFormat?: string;
}

export interface EmployeeAddress {
  street: string;
  streetNumber?: string; // Added streetNumber property
  city: string;
  postalCode: string;
  country: string;
  state?: string;
}

export interface EmployeePhotoMeta {
  fileName: string;
  fileType: string;
  fileSize: number;
  updatedAt: string;
}

export interface EducationEntry {
  degree: string;
  school: string;
  year: string;
}

export interface WorkSchedule {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday?: string;
  sunday?: string;
}
