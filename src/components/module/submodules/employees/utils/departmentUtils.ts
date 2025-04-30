
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Récupère le nom du département à partir de son ID
 */
export const getDepartmentName = (
  departmentId: string | undefined, 
  departments: Department[] | undefined
): string => {
  if (!departmentId || !departments || !Array.isArray(departments)) {
    return 'Département non spécifié';
  }

  const department = departments.find(dept => dept.id === departmentId);
  return department?.name || 'Département inconnu';
};

/**
 * Récupère la couleur du département à partir de son ID
 */
export const getDepartmentColor = (
  departmentId: string | undefined,
  departments: Department[] | undefined
): string => {
  if (!departmentId || !departments || !Array.isArray(departments)) {
    return '#3b82f6'; // Couleur par défaut (bleu)
  }
  
  const department = departments.find(dept => dept.id === departmentId);
  return department?.color || '#3b82f6';
};

/**
 * Récupère le manager du département à partir de son ID
 */
export const getDepartmentManager = (
  departmentId: string | undefined,
  departments: Department[] | undefined
): { id?: string; name?: string } => {
  if (!departmentId || !departments || !Array.isArray(departments)) {
    return { id: undefined, name: undefined };
  }
  
  const department = departments.find(dept => dept.id === departmentId);
  if (!department) {
    return { id: undefined, name: undefined };
  }
  
  return {
    id: department.managerId,
    name: department.managerName
  };
};
