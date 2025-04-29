
import { DepartmentFormData, departmentColors } from "../types";

/**
 * Create an empty department form data object
 * @returns Empty department form data
 */
export const createEmptyFormData = (): DepartmentFormData => ({
  name: '',
  description: '',
  managerId: '',
  companyId: '',
  color: departmentColors[0].value,
  employeeIds: []
});

/**
 * Get department name from ID
 * @param departmentId The department ID
 * @param departments List of departments
 * @returns The department name or "Non spécifié" if not found
 */
export const getDepartmentName = (
  departmentId: string | undefined,
  departments: any[] | undefined
): string => {
  if (!departmentId || !departments || !Array.isArray(departments)) {
    return 'Non spécifié';
  }
  const department = departments.find(d => d.id === departmentId);
  return department?.name || 'Non spécifié';
};

/**
 * Get color name from hex value
 * @param colorValue Hex color value
 * @returns Color name or "Personnalisée" if not found
 */
export const getColorName = (colorValue: string): string => {
  const color = departmentColors.find(c => c.value === colorValue);
  return color?.label || 'Personnalisée';
};

/**
 * Format department for display
 * @param department Department object
 * @returns Formatted department object
 */
export const formatDepartment = (department: any): any => {
  return {
    ...department,
    managerId: department.managerId || '',
    managerName: department.managerName || 'Non assigné',
    employeeIds: department.employeeIds || [],
    employeesCount: department.employeesCount || 0,
    color: department.color || departmentColors[0].value,
    companyId: department.companyId || '',
    companyName: department.companyName || 'Non assigné',
  };
};
