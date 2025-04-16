
// Types pour le module de gestion des départements

// Structure d'un département
export interface Department {
  id?: string;
  name: string;
  description: string;
  managerId?: string | null;
  managerName?: string | null;
  color?: string;
  employeeIds?: string[];
  employeesCount?: number;
  createdAt?: string;
  updatedAt?: string;
  companyId?: string | null;
}

// Structure pour le formulaire de département
export interface DepartmentFormData {
  id: string;
  name: string;
  description: string;
  managerId: string;
  managerName: string;
  color: string;
  companyId: string;
}

// Couleurs disponibles pour les départements
export const departmentColors = [
  { label: 'Bleu', value: '#3b82f6' },
  { label: 'Rouge', value: '#ef4444' },
  { label: 'Vert', value: '#22c55e' },
  { label: 'Jaune', value: '#eab308' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Rose', value: '#ec4899' },
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Gris', value: '#6b7280' },
  { label: 'Turquoise', value: '#14b8a6' }
];
