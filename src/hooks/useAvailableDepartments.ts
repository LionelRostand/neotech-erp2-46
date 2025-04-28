
import { useFirebaseDepartments } from './useFirebaseDepartments';
import { useCallback, useMemo } from 'react';
import { Department } from '@/components/module/submodules/departments/types';

export const useAvailableDepartments = () => {
  const { departments = [], isLoading = false, error, refetch } = useFirebaseDepartments();

  // Ensure we have valid departments data with all required fields
  const formattedDepartments = useMemo(() => {
    // Defensive check to ensure departments is always an array
    if (!departments || !Array.isArray(departments)) {
      console.warn('Departments data is not an array:', departments);
      return [];
    }

    return departments
      .filter(dept => dept && typeof dept === 'object') // Ensure we have a valid object
      .map(dept => ({
        id: dept.id || `dept-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: dept.name || `Département ${dept.id?.substring(0, 5) || ''}`,
        description: dept.description || '',
        managerId: dept.managerId || '',
        managerName: dept.managerName || '',
        color: dept.color || '#3b82f6'
      }));
  }, [departments]);

  // Always return a valid array, even if empty
  const safeDepartments: Department[] = formattedDepartments || [];

  return {
    departments: safeDepartments,
    isLoading,
    error,
    refetchDepartments: refetch
  };
};
