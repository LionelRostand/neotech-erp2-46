
import { useMemo } from 'react';
import { useEmployeeData } from './useEmployeeData';
import { deduplicateDepartments } from '@/components/module/submodules/departments/utils/departmentUtils';

export const useAvailableDepartments = () => {
  // Use the centralized employee data hook to avoid duplicate requests
  const { departments, isLoading, error } = useEmployeeData();

  // Format departments once and memoize the result to prevent unnecessary rerendering
  const formattedDepartments = useMemo(() => {
    if (!departments || departments.length === 0) {
      return [];
    }
    
    // First deduplicate the departments
    const uniqueDepartments = deduplicateDepartments(departments);
    
    // Then format them
    return uniqueDepartments.map(dept => ({
      id: dept.id || '',
      name: dept.name || '',
      description: dept.description || '',
      managerId: dept.managerId || '',
      managerName: dept.managerName || '',
      color: dept.color || '#3b82f6'
    }));
  }, [departments]);

  return {
    departments: formattedDepartments,
    isLoading,
    error,
    // We don't need a separate refetch here since we're using the central data source
    refetchDepartments: () => {} // Empty function for API compatibility
  };
};
