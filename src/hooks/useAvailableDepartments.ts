
import { useFirebaseDepartments } from './useFirebaseDepartments';

export const useAvailableDepartments = () => {
  const { departments, isLoading, error } = useFirebaseDepartments();

  const formattedDepartments = departments?.map(dept => ({
    id: dept.id,
    name: dept.name,
    managerId: dept.managerId || '',
    managerName: dept.managerName || ''
  })) || [];

  return {
    departments: formattedDepartments,
    isLoading,
    error
  };
};
