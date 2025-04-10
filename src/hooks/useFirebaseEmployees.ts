
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirebaseCollection } from './useFirebaseCollection';
import { where, QueryConstraint } from 'firebase/firestore';

// Interface pour les données d'employés
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  department?: string;
  companyId?: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  [key: string]: any;
}

/**
 * Hook pour récupérer les employés depuis Firebase avec mise à jour en temps réel
 * @param companyId Optionnel - ID de l'entreprise pour filtrer les employés
 */
export const useFirebaseEmployees = (companyId?: string) => {
  // Préparer les contraintes de requête si un ID d'entreprise est fourni
  const queryConstraints: QueryConstraint[] = [];
  
  if (companyId) {
    queryConstraints.push(where('companyId', '==', companyId));
  }
  
  const { 
    data: employees, 
    isLoading, 
    error, 
    refetch 
  } = useFirebaseCollection<Employee>(COLLECTIONS.EMPLOYEES, queryConstraints);

  return { employees, isLoading, error, refetch };
};
