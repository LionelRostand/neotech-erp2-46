
import { useState, useEffect, useCallback } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: string;
  startDate: string;
  endDate: string;
  status: 'En attente' | 'Approuvé' | 'Refusé';
  days: number;
  reason?: string;
  createdAt?: any;
  updatedAt?: any;
}

export const useEmployeeLeaves = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useSafeFirestore(COLLECTIONS.LEAVES);

  const fetchLeaves = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await firestore.getAll();
      console.log('Fetched leaves data:', result);
      setLeaves(result as LeaveRequest[]);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      toast.error("Erreur lors du chargement des congés");
    } finally {
      setIsLoading(false);
    }
  }, [firestore]);

  const addLeave = async (leave: Partial<LeaveRequest>) => {
    try {
      const result = await firestore.add(leave);
      toast.success("Demande de congé ajoutée avec succès");
      await fetchLeaves();
      return result;
    } catch (error) {
      console.error('Error adding leave request:', error);
      toast.error("Erreur lors de l'ajout de la demande de congé");
      throw error;
    }
  };

  const updateLeave = async (id: string, data: Partial<LeaveRequest>) => {
    try {
      await firestore.update(id, data);
      toast.success("Demande de congé mise à jour avec succès");
      await fetchLeaves();
    } catch (error) {
      console.error('Error updating leave request:', error);
      toast.error("Erreur lors de la mise à jour de la demande de congé");
      throw error;
    }
  };

  const deleteLeave = async (id: string) => {
    try {
      await firestore.remove(id);
      toast.success("Demande de congé supprimée avec succès");
      await fetchLeaves();
    } catch (error) {
      console.error('Error deleting leave request:', error);
      toast.error("Erreur lors de la suppression de la demande de congé");
      throw error;
    }
  };

  useEffect(() => {
    console.log('useEmployeeLeaves hook: Initial data fetch');
    fetchLeaves();
  }, [fetchLeaves]);

  return {
    leaves,
    isLoading,
    addLeave,
    updateLeave,
    deleteLeave,
    refreshLeaves: fetchLeaves
  };
};
