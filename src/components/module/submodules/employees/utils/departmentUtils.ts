
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Get department name from ID
 * @param departmentId The department ID
 * @param departments List of departments
 * @returns The department name or "Non spécifié" if not found
 */
export const getDepartmentName = (
  departmentId: string | undefined,
  departments: Department[]
): string => {
  if (!departmentId || !departments?.length) {
    return 'Non spécifié';
  }
  
  const department = departments.find(d => d.id === departmentId);
  return department?.name || 'Non spécifié';
};
