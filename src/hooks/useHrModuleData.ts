
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from './useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Employee } from '@/types/employee';
import { refreshEmployeesData } from '@/components/module/submodules/employees/services/employeeService';

export const useHrModuleData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const employeesCollection = useFirestore(COLLECTIONS.HR.EMPLOYEES);
  const departmentsCollection = useFirestore(COLLECTIONS.HR.DEPARTMENTS);
  const companiesCollection = useFirestore(COLLECTIONS.HR.COMPANIES);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Récupération des employés
      const employeesData = await employeesCollection.getAll();
      setEmployees(employeesData as Employee[]);

      // Récupération des départements
      const departmentsData = await departmentsCollection.getAll();
      setDepartments(departmentsData);

      // Récupération des entreprises
      const companiesData = await companiesCollection.getAll();
      setCompanies(companiesData);
    } catch (err) {
      console.error('Erreur lors de la récupération des données RH:', err);
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setIsLoading(false);
    }
  }, [employeesCollection, departmentsCollection, companiesCollection]);

  // Fonction pour rafraîchir les données des employés
  const refreshEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      // Utiliser la fonction du service pour récupérer les données fraîches
      const refreshedEmployees = await refreshEmployeesData();
      if (Array.isArray(refreshedEmployees)) {
        setEmployees(refreshedEmployees);
      }
    } catch (err) {
      console.error('Erreur lors du rafraîchissement des employés:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    employees,
    departments,
    companies,
    isLoading,
    error,
    refreshEmployees
  };
};
