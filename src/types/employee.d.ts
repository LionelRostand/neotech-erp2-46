
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
  documents?: string[];
  createdAt?: string;
  updatedAt?: string;
  socialSecurityNumber?: string;
  bannerColor?: string;
  skills?: string[];
  education?: EducationEntry[];
  workSchedule?: WorkSchedule;
  role?: string;
  isManager?: boolean; // Rendu optionnel et booléen
  userAccountId?: string;
  payslips?: string[];
  title?: string;
}
