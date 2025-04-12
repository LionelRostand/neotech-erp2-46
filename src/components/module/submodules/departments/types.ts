
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string | null;
  managerName?: string | null;
  employeesCount?: number;
  color?: string;
  employeeIds?: string[];
  createdAt?: string;
  updatedAt?: string;
  parentDepartmentId?: string;
}

export interface DepartmentFormData {
  id: string;
  name: string;
  description: string;
  managerId: string;
  color: string;
  employeeIds: string[];
}

export const departmentColors = [
  { label: 'Bleu', value: '#3b82f6' },
  { label: 'Rouge', value: '#ef4444' },
  { label: 'Vert', value: '#10b981' },
  { label: 'Jaune', value: '#f59e0b' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Rose', value: '#ec4899' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Bleu Ciel', value: '#0ea5e9' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Vert Émeraude', value: '#10b981' },
];
