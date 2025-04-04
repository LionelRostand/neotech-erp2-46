
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  department: string;
  departmentId?: string;
  position: string;
  contract: string;
  hireDate: string;
  manager?: string;
  managerId?: string; // Added managerId property
  status: string;
  createdAt?: string;
  updatedAt?: string;
  photo?: string;
  photoURL?: string;
  professionalEmail?: string;
  company?: string;
  title?: string;
  education?: EducationItem[];
  skills?: string[];
  documents?: Document[];
  workSchedule?: {
    [key: string]: string;
  };
  payslips?: string[];
  baseSalary?: number;
}

export interface EducationItem {
  degree: string;
  school: string;
  year: string;
}

export interface Document {
  name: string;
  date: string;
  type: string;
}
