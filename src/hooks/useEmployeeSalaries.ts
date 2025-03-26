
import { useState, useEffect, useCallback } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export interface EmployeeSalary {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  currency: string;
  effectiveDate: string;
  paymentDate: string;
  status: string;
  bonuses?: { type: string; amount: number }[];
  deductions?: { type: string; amount: number }[];
  notes?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const useEmployeeSalaries = () => {
  const [salaries, setSalaries] = useState<EmployeeSalary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useSafeFirestore(COLLECTIONS.SALARIES);

  const fetchSalaries = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await firestore.getAll();
      console.log('Fetched salaries data:', result);
      setSalaries(result as EmployeeSalary[]);
    } catch (error) {
      console.error('Error fetching salaries:', error);
      toast.error("Erreur lors du chargement des salaires");
    } finally {
      setIsLoading(false);
    }
  }, [firestore]);

  const addSalary = async (salary: Partial<EmployeeSalary>) => {
    try {
      const result = await firestore.add(salary);
      toast.success("Salaire ajouté avec succès");
      await fetchSalaries();
      return result;
    } catch (error) {
      console.error('Error adding salary:', error);
      toast.error("Erreur lors de l'ajout du salaire");
      throw error;
    }
  };

  const updateSalary = async (id: string, data: Partial<EmployeeSalary>) => {
    try {
      await firestore.update(id, data);
      toast.success("Salaire mis à jour avec succès");
      await fetchSalaries();
    } catch (error) {
      console.error('Error updating salary:', error);
      toast.error("Erreur lors de la mise à jour du salaire");
      throw error;
    }
  };

  const deleteSalary = async (id: string) => {
    try {
      await firestore.remove(id);
      toast.success("Salaire supprimé avec succès");
      await fetchSalaries();
    } catch (error) {
      console.error('Error deleting salary:', error);
      toast.error("Erreur lors de la suppression du salaire");
      throw error;
    }
  };

  useEffect(() => {
    console.log('useEmployeeSalaries hook: Initial data fetch');
    fetchSalaries();
  }, [fetchSalaries]);

  return {
    salaries,
    isLoading,
    addSalary,
    updateSalary,
    deleteSalary,
    refreshSalaries: fetchSalaries
  };
};
