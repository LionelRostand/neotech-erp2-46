
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
  companyId?: string;
  color?: string;
  employeeIds?: string[];
}

// Color options for department selection
export const departmentColors = [
  { label: "Blue", value: "#3B82F6" },
  { label: "Green", value: "#10B981" },
  { label: "Red", value: "#EF4444" },
  { label: "Yellow", value: "#F59E0B" },
  { label: "Purple", value: "#8B5CF6" },
  { label: "Pink", value: "#EC4899" },
  { label: "Indigo", value: "#6366F1" },
  { label: "Teal", value: "#14B8A6" },
  { label: "Orange", value: "#F97316" },
  { label: "Cyan", value: "#06B6D4" }
];
