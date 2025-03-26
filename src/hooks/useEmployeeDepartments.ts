
import { useState, useEffect, useCallback } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export interface Department {
  id: string;
  name: string;
  description?: string;
  manager?: string;
  employeeCount?: number;
  location?: string;
  budget?: number;
  status?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const useEmployeeDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useSafeFirestore(COLLECTIONS.DEPARTMENTS);

  const fetchDepartments = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await firestore.getAll();
      console.log('Fetched departments data:', result);
      setDepartments(result as Department[]);
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error("Erreur lors du chargement des départements");
    } finally {
      setIsLoading(false);
    }
  }, [firestore]);

  const addDepartment = async (department: Partial<Department>) => {
    try {
      const result = await firestore.add(department);
      toast.success("Département ajouté avec succès");
      await fetchDepartments();
      return result;
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error("Erreur lors de l'ajout du département");
      throw error;
    }
  };

  const updateDepartment = async (id: string, data: Partial<Department>) => {
    try {
      await firestore.update(id, data);
      toast.success("Département mis à jour avec succès");
      await fetchDepartments();
    } catch (error) {
      console.error('Error updating department:', error);
      toast.error("Erreur lors de la mise à jour du département");
      throw error;
    }
  };

  const deleteDepartment = async (id: string) => {
    try {
      await firestore.remove(id);
      toast.success("Département supprimé avec succès");
      await fetchDepartments();
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error("Erreur lors de la suppression du département");
      throw error;
    }
  };

  useEffect(() => {
    console.log('useEmployeeDepartments hook: Initial data fetch');
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments,
    isLoading,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    refreshDepartments: fetchDepartments
  };
};
