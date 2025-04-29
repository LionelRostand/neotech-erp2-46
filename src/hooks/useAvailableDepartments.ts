
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

  // S'assurer que nous avons des données de département valides avec tous les champs requis
  const formattedDepartments = useMemo(() => {
    // Vérification défensive pour s'assurer que les départements sont toujours un tableau
    if (!departments || !Array.isArray(departments)) {
      console.log('Les données de département ne constituent pas un tableau:', departments);
      return [];
    }

    return departments
      .filter(dept => dept && typeof dept === 'object') // S'assurer que nous avons un objet valide
      .map(dept => ({
        id: dept.id || `dept-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: dept.name || `Département ${dept.id?.substring(0, 5) || ''}`,
        description: dept.description || '',
        managerId: dept.managerId || '',
        managerName: dept.managerName || '',
        companyId: dept.companyId || companyId || '',
        companyName: dept.companyName || '',
        color: dept.color || '#3b82f6',
        employeeIds: Array.isArray(dept.employeeIds) ? dept.employeeIds : [],
        employeesCount: typeof dept.employeesCount === 'number' ? dept.employeesCount : 0
      }) as Department);
  }, [departments, companyId]);

  // Toujours renvoyer un tableau valide, même s'il est vide
  return {
    departments: formattedDepartments,
    isLoading,
    error,
    refetchDepartments: refetch
  };
};
