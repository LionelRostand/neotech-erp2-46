
import { useState, useEffect } from 'react';
import { Employee } from '@/types/employee';
import { useHrModuleData } from './useHrModuleData';

/**
 * Hook pour accéder aux données des employés
 */
export const useEmployeeData = () => {
  const { employees: rawEmployees, isLoading, error, refetchEmployees } = useHrModuleData();
  const [employees, setEmployees] = useState<Employee[]>([]);
  
  // Dédupliquer et nettoyer les données des employés
  useEffect(() => {
    if (rawEmployees && rawEmployees.length > 0) {
      const uniqueEmployeesMap = new Map<string, Employee>();
      
      // Parcourir tous les employés et ne garder que les entrées uniques selon l'ID
      rawEmployees.forEach(emp => {
        if (!uniqueEmployeesMap.has(emp.id)) {
          uniqueEmployeesMap.set(emp.id, {
            ...emp,
            // S'assurer que toutes les propriétés requises sont présentes
            firstName: emp.firstName || '',
            lastName: emp.lastName || '',
            email: emp.email || '',
            position: emp.position || emp.role || 'Employé',
            status: emp.status || 'active'
          });
        }
      });
      
      setEmployees(Array.from(uniqueEmployeesMap.values()));
    } else {
      setEmployees([]);
    }
  }, [rawEmployees]);
  
  return {
    employees,
    isLoading,
    error,
    refetchEmployees
  };
};
