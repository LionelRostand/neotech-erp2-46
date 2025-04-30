
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  employeesCount?: number;
  employeeIds?: string[];
  budget?: number;
  color?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Couleurs disponibles pour les départements
export const departmentColors = [
  '#3b82f6', // Bleu
  '#10b981', // Vert
  '#ef4444', // Rouge
  '#f59e0b', // Orange
  '#8b5cf6', // Violet
  '#ec4899', // Rose
  '#06b6d4', // Cyan
  '#84cc16', // Vert lime
  '#6366f1', // Indigo
  '#d946ef', // Magenta
  '#f97316', // Orange foncé
  '#0ea5e9', // Bleu clair
  '#14b8a6', // Turquoise
  '#a855f7', // Violet clair
  '#4b5563', // Gris
];
