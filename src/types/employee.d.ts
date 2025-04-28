
export interface EmployeePhotoMeta {
  data: string;
  updatedAt: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

export interface Skill {
  id: string;
  name: string;
  level: string;
}

export interface WorkDay {
  isWorkDay: boolean;
  shifts: { start: string; end: string }[];
}

export interface Schedule {
  monday?: WorkDay;
  tuesday?: WorkDay;
  wednesday?: WorkDay;
  thursday?: WorkDay;
  friday?: WorkDay;
  saturday?: WorkDay;
  sunday?: WorkDay;
  [key: string]: WorkDay | undefined;
}

export interface Document {
  id: string;
  title: string;
  type: 'contract' | 'id' | 'certificate' | 'other';
  date: string;
  fileUrl: string;
  description?: string;
  uploadedAt: string;
}

export interface Evaluation {
  id: string;
  date: string;
  type: 'performance' | 'skills' | 'objectives';
  score: string;
  evaluator: string;
  comments?: string;
}

export interface Absence {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'approved' | 'pending' | 'rejected';
  reason?: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  status: 'active' | 'inactive' | 'onLeave' | 'Actif' | 'En congé' | 'Suspendu' | 'Inactif';
  hireDate?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  salary?: number;
  manager?: string;
  isManager?: boolean;
  photoUrl?: string;
  photoMeta?: EmployeePhotoMeta;
  skills?: (Skill | string)[];  // Updated to allow for string skills for backward compatibility
  schedule?: Schedule;
  documents?: Document[];
  evaluations?: Evaluation[];
  absences?: Absence[];
  contract?: string;
}
