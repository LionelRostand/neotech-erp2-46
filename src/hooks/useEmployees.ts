
import { useState, useEffect } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { Employee } from '@/types/employee';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useSafeFirestore(COLLECTIONS.EMPLOYEES);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const result = await firestore.getAll();
      setEmployees(result as Employee[]);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error("Erreur lors du chargement des employés");
    } finally {
      setIsLoading(false);
    }
  };

  const addEmployee = async (employee: Partial<Employee>) => {
    try {
      const result = await firestore.add(employee);
      toast.success("Employé ajouté avec succès");
      await fetchEmployees();
      return result;
    } catch (error) {
      console.error('Error adding employee:', error);
      toast.error("Erreur lors de l'ajout de l'employé");
      throw error;
    }
  };

  const updateEmployee = async (id: string, data: Partial<Employee>) => {
    try {
      await firestore.update(id, data);
      toast.success("Employé mis à jour avec succès");
      await fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error("Erreur lors de la mise à jour de l'employé");
      throw error;
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      await firestore.remove(id);
      toast.success("Employé supprimé avec succès");
      await fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast.error("Erreur lors de la suppression de l'employé");
      throw error;
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return {
    employees,
    isLoading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refreshEmployees: fetchEmployees
  };
};
