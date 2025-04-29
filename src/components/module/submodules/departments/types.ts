
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
  companyName?: string;
}

export interface DepartmentFormData {
  id?: string;
  name: string;
  description: string;
  managerId?: string;
  companyId?: string;
  color: string;
  employeeIds?: string[];
}

export const departmentColors = [
  { label: 'Bleu', value: '#3b82f6' },
  { label: 'Rouge', value: '#ef4444' },
  { label: 'Vert', value: '#10b981' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Rose', value: '#ec4899' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Ambre', value: '#f59e0b' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Turquoise', value: '#14b8a6' },
  { label: 'Fuchsia', value: '#d946ef' },
  { label: 'Citron vert', value: '#84cc16' }
];

export const createEmptyFormData = (): DepartmentFormData => ({
  name: '',
  description: '',
  managerId: '',
  companyId: '',
  color: '#3b82f6',
  employeeIds: []
});
