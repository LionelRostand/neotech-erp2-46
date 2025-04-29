
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

export const departmentColors = [
  '#3b82f6', // blue
  '#ef4444', // red
  '#10b981', // green
  '#f97316', // orange
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#d946ef', // fuchsia
  '#84cc16'  // lime
];
