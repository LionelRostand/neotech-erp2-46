
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
  // Ajouter la référence à l'entreprise
  company?: string;
  // Autres propriétés
  education?: EducationItem[];
  skills?: string[];
  documents?: Document[];
  workSchedule?: {
    [key: string]: string;
  };
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
