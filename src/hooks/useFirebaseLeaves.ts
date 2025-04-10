
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirebaseCollection } from './useFirebaseCollection';
import { where, QueryConstraint } from 'firebase/firestore';

// Interface pour les données de congés
export interface Leave {
  id: string;
  employeeId: string;
  type: 'paid' | 'unpaid' | 'sick' | 'maternity' | 'paternity' | 'other';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'canceled';
  reason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook pour récupérer les congés depuis Firebase avec mise à jour en temps réel
 * @param employeeId Optionnel - ID de l'employé pour filtrer les congés
 */
export const useFirebaseLeaves = (employeeId?: string) => {
  // Préparer les contraintes de requête si un ID d'employé est fourni
  const queryConstraints: QueryConstraint[] = [];
  
  if (employeeId) {
    queryConstraints.push(where('employeeId', '==', employeeId));
  }
  
  const { 
    data: leaves, 
    isLoading, 
    error, 
    refetch 
  } = useFirebaseCollection<Leave>(COLLECTIONS.HR.LEAVES, queryConstraints);

  return { leaves, isLoading, error, refetch };
};
