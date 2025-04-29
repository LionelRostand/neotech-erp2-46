
import { useFirebaseDepartments } from './useFirebaseDepartments';
import { useMemo } from 'react';
import { Department } from '@/components/module/submodules/departments/types';

/**
 * Hook personnalisé qui renvoie les départements disponibles pour une entreprise spécifique
 * @param companyId Optionnel - ID de l'entreprise pour filtrer les départements
 */
export const useAvailableDepartments = (companyId?: string) => {
  // Utiliser useFirebaseDepartments pour récupérer les départements avec le filtre d'entreprise
  const { departments = [], isLoading = false, error, refetch } = useFirebaseDepartments(companyId);

  // Ensure we have valid departments data with all required fields
  const formattedDepartments = useMemo(() => {
    // Defensive check to ensure departments is always an array
    if (!departments || !Array.isArray(departments)) {
      console.log('Departments data is not an array:', departments);
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
        companyId: dept.companyId || companyId || '',
        color: dept.color || '#3b82f6',
        employeeIds: Array.isArray(dept.employeeIds) ? dept.employeeIds : [],
        employeesCount: typeof dept.employeesCount === 'number' ? dept.employeesCount : 0
      }));
  }, [departments, companyId]);

  // Always return a valid array, even if empty
  const safeDepartments: Department[] = formattedDepartments || [];

  return {
    departments: safeDepartments,
    isLoading,
    error,
    refetchDepartments: refetch
  };
};
