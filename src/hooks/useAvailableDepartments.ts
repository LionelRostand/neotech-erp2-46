
import { useFirebaseDepartments } from './useFirebaseDepartments';
import { useCallback } from 'react';

export const useAvailableDepartments = () => {
  const { departments = [], isLoading = false, error, refetch } = useFirebaseDepartments();

  // Ensure we have valid departments data with all required fields
  const formattedDepartments = useCallback(() => {
    if (!departments || !Array.isArray(departments)) {
      console.warn('Departments data is not an array:', departments);
      return [];
    }

    return departments.map(dept => ({
      id: dept.id || '',
      name: dept.name || '',
      description: dept.description || '',
      managerId: dept.managerId || '',
      managerName: dept.managerName || '',
      color: dept.color || '#3b82f6'
    }));
  }, [departments]);

  return {
    departments: formattedDepartments(),
    isLoading,
    error,
    refetchDepartments: refetch
  };
};
