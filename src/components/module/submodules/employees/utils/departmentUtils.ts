
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Get department name from id
 * @param departmentId Department ID
 * @param departments List of departments
 * @returns Department name or unknown department
 */
export const getDepartmentName = (departmentId?: string, departments: Department[] = []): string => {
  if (!departmentId) return 'Département non spécifié';
  
  // Check if departments exists and is an array
  if (!Array.isArray(departments)) {
    console.warn('Invalid departments format');
    return departmentId;
  }
  
  // Find department by id
  const department = departments.find(
    dept => dept.id === departmentId
  );
  
  // Return department name if found, otherwise return the ID
  return department ? department.name : departmentId;
};

/**
 * Get department by id
 * @param departmentId Department ID
 * @param departments List of departments
 * @returns Department object or undefined
 */
export const getDepartment = (departmentId?: string, departments: Department[] = []): Department | undefined => {
  if (!departmentId) return undefined;
  
  // Check if departments exists and is an array
  if (!Array.isArray(departments)) {
    console.warn('Invalid departments format');
    return undefined;
  }
  
  // Find department by id
  return departments.find(dept => dept.id === departmentId);
};
