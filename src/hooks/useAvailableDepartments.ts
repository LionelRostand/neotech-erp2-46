
import { useFirebaseDepartments } from './useFirebaseDepartments';

export const useAvailableDepartments = () => {
  const { departments, isLoading, error, refetch } = useFirebaseDepartments();

  const formattedDepartments = departments?.map(dept => ({
    id: dept.id,
    name: dept.name,
    description: dept.description,
    managerId: dept.managerId || '',
    managerName: dept.managerName || '',
    color: dept.color || '#3b82f6'
  })) || [];

  return {
    departments: formattedDepartments,
    isLoading,
    error,
    refetchDepartments: refetch
  };
};
