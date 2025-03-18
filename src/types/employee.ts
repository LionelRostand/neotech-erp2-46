
export interface Education {
  degree: string;
  school: string;
  year: string;
}

export interface Document {
  name: string;
  date: string;
  type: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  hireDate: string;
  status: "Actif" | "Inactif";
  contract: string;
  manager: string;
  education: Education[];
  skills: string[];
  documents: Document[];
  workSchedule: {
    [key: string]: string;
  };
}
