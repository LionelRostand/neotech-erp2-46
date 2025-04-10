
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirebaseCollection } from './useFirebaseCollection';
import { where, QueryConstraint } from 'firebase/firestore';

// Interface pour les données de départements
export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  companyId?: string;
  employeesCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Hook pour récupérer les départements depuis Firebase avec mise à jour en temps réel
 * @param companyId Optionnel - ID de l'entreprise pour filtrer les départements
 */
export const useFirebaseDepartments = (companyId?: string) => {
  // Préparer les contraintes de requête si un ID d'entreprise est fourni
  const queryConstraints: QueryConstraint[] = [];
  
  if (companyId) {
    queryConstraints.push(where('companyId', '==', companyId));
  }
  
  const { 
    data: departments, 
    isLoading, 
    error, 
    refetch 
  } = useFirebaseCollection<Department>(COLLECTIONS.HR.DEPARTMENTS, queryConstraints);

  return { departments, isLoading, error, refetch };
};
