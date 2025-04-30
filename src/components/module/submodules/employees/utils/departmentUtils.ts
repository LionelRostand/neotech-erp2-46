
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Récupère le nom du département à partir de son ID
 * @param departmentId - L'ID du département
 * @param departments - La liste des départements disponibles
 * @returns Le nom du département ou un message par défaut
 */
export const getDepartmentName = (departmentId?: string, departments?: Department[]): string => {
  if (!departmentId) return 'Aucun département';
  if (!departments || !Array.isArray(departments)) return `Département ${departmentId}`;
  
  const department = departments.find(dept => dept && dept.id === departmentId);
  return department ? (department.name || `Département ${departmentId.substring(0, 5)}`) : `Département ${departmentId.substring(0, 5)}`;
};

/**
 * Récupère la couleur du département à partir de son ID
 * @param departmentId - L'ID du département
 * @param departments - La liste des départements disponibles
 * @returns La couleur du département ou une couleur par défaut
 */
export const getDepartmentColor = (departmentId?: string, departments?: Department[]): string => {
  if (!departmentId || !departments || !Array.isArray(departments)) return '#3b82f6'; // Blue default
  
  const department = departments.find(dept => dept && dept.id === departmentId);
  return department?.color || '#3b82f6';
};

/**
 * Récupère le département complet à partir de son ID
 * @param departmentId - L'ID du département
 * @param departments - La liste des départements disponibles
 * @returns Le département ou undefined si non trouvé
 */
export const getDepartment = (departmentId?: string, departments?: Department[]): Department | undefined => {
  if (!departmentId || !departments || !Array.isArray(departments)) return undefined;
  
  return departments.find(dept => dept && dept.id === departmentId);
};
