import { Employee } from '@/types/employee';
import { generateUniqueId } from './utils/departmentUtils';

export interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string | null;
  managerName?: string | null;
  color: string;
  employeeIds: string[];
  employeesCount: number;
  companyId: string | null;
}

export interface DepartmentFormData {
  id: string;
  name: string;
  description: string;
  managerId: string;
  color: string;
  employeeIds?: string[];
  companyId?: string;
}

export interface DepartmentColor {
  label: string;
  value: string;
}

export const departmentColors: DepartmentColor[] = [
  { label: "Rouge", value: "#ef4444" },
  { label: "Vert", value: "#22c55e" },
  { label: "Bleu", value: "#3b82f6" },
  { label: "Jaune", value: "#eab308" },
  { label: "Orange", value: "#f97316" },
  { label: "Violet", value: "#8b5cf6" },
  { label: "Rose", value: "#f472b6" },
  { label: "Gris", value: "#6b7280" },
];

export const createEmptyFormData = (departments: Department[]): DepartmentFormData => {
  // Générer un nouvel ID unique
  const newId = generateUniqueId(departments);
  
  return {
    id: newId,
    name: "",
    description: "",
    managerId: "",
    color: departmentColors[0].value,
    employeeIds: [],
    companyId: ""
  };
};

export interface DepartmentEmployee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
}
