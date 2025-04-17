
import { useState } from 'react';
import { Employee } from '@/types/employee';
import { useEmployeeService } from './useEmployeeService';

/**
 * Hook pour ajouter un employé
 */
export const useAddEmployee = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { addEmployee: serviceAddEmployee } = useEmployeeService();

  /**
   * Ajouter un nouvel employé
   */
  const addEmployee = async (employeeData: Partial<Employee>): Promise<Employee | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await serviceAddEmployee(employeeData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addEmployee,
    isLoading,
    error
  };
};
