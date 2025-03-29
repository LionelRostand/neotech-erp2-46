
import { useEffect, useState } from 'react';
import { Employee } from '@/types/employee';
import { getEmployeesData, refreshEmployeesData } from '@/components/module/submodules/employees/services/employeeService';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export const useEmployeeData = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isOffline } = useAuth();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployeesData();
      setEmployees(data);
    } catch (err) {
      console.error("Erreur lors du chargement des employés:", err);
      setError("Impossible de charger les données des employés");
      toast.error("Échec du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const refreshEmployees = async () => {
    if (isOffline) {
      toast.warning("Mode hors-ligne actif. Impossible d'actualiser les données.");
      return employees; // Retourner les données actuellement en mémoire
    }

    try {
      setLoading(true);
      setError(null);
      const refreshedData = await refreshEmployeesData();
      setEmployees(refreshedData);
      return refreshedData;
    } catch (err) {
      console.error("Erreur lors de l'actualisation des employés:", err);
      setError("Impossible d'actualiser les données des employés");
      toast.error("Échec de l'actualisation des données");
      return employees; // Retourner les données non actualisées en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  const filterEmployeesByCompany = (companyId: string) => {
    if (companyId === 'all') {
      return employees;
    }
    return employees.filter(emp => emp.company === companyId);
  };

  const filterEmployeesByDepartment = (department: string) => {
    if (department === 'all') {
      return employees;
    }
    return employees.filter(emp => emp.department === department);
  };

  const filterEmployeesByStatus = (status: string) => {
    if (status === 'all') {
      return employees;
    }
    return employees.filter(emp => emp.status === status);
  };

  const searchEmployees = (query: string) => {
    if (!query) {
      return employees;
    }
    const lowerQuery = query.toLowerCase();
    return employees.filter(emp => 
      `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(lowerQuery) ||
      emp.email.toLowerCase().includes(lowerQuery) ||
      emp.position.toLowerCase().includes(lowerQuery) ||
      emp.department.toLowerCase().includes(lowerQuery)
    );
  };

  return {
    employees,
    loading,
    error,
    refreshEmployees,
    filterEmployeesByCompany,
    filterEmployeesByDepartment,
    filterEmployeesByStatus,
    searchEmployees
  };
};
