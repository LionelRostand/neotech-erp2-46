
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Get department name from ID
 * @param departmentId The department ID
 * @param departments List of departments
 * @returns The department name or "Non spécifié" if not found
 */
export const getDepartmentName = (
  departmentId: string | undefined,
  departments: Department[] | undefined
): string => {
  // Check if departmentId and departments are both defined and departments is an array
  if (!departmentId || !departments || !Array.isArray(departments) || departments.length === 0) {
    return 'Non spécifié';
  }
  
  const department = departments.find(d => d.id === departmentId);
  return department?.name || 'Non spécifié';
};
