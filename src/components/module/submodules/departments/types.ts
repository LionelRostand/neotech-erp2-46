export interface Department {
  id: string;
  name: string;
  description: string;
  managerId: string | null;
  managerName: string | null;
  employeesCount: number;
  color: string;
  employeeIds: string[];
  createdAt?: string;
  updatedAt?: string;
  parentId?: string;
}

export interface DepartmentFormData {
  id: string;
  name: string;
  description: string;
  managerId: string;
  color: string;
  employeeIds: string[];
  companyId?: string;
}

export const departmentColors = [
  { value: "#3b82f6", label: "Bleu" },
  { value: "#10b981", label: "Vert" },
  { value: "#ef4444", label: "Rouge" },
  { value: "#f59e0b", label: "Orange" },
  { value: "#8b5cf6", label: "Violet" },
  { value: "#ec4899", label: "Rose" },
  { value: "#6b7280", label: "Gris" },
  { value: "#111827", label: "Noir" }
];
