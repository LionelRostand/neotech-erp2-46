
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  department: string;
  position: string;
  contract: string;
  hireDate: string;
  manager?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  photo?: string;
  professionalEmail?: string;
  company?: string;
  // Add missing properties
  education?: EducationItem[];
  skills?: string[];
  documents?: Document[];
  workSchedule?: {
    [key: string]: string;
  };
  // Ajout d'un tableau pour stocker les références aux fiches de paie
  payslips?: string[];
  // Ajout d'un champ pour le salaire de base
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
