
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string | null;
  employeeIds?: string[];
  employeesCount?: number;
  color?: string;
  companyId?: string;
}

export interface DepartmentFormData {
  id: string;
  name: string;
  description: string;
  managerId: string;
  companyId: string;
  color: string;
  employeeIds?: string[];
}

export const departmentColors = [
  { label: "Bleu", value: "#3B82F6" },
  { label: "Vert", value: "#22C55E" },
  { label: "Rouge", value: "#EF4444" },
  { label: "Jaune", value: "#F59E0B" },
  { label: "Violet", value: "#8B5CF6" },
  { label: "Rose", value: "#EC4899" },
  { label: "Indigo", value: "#6366F1" },
  { label: "Turquoise", value: "#06B6D4" }
];
