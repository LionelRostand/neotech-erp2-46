
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirebaseCollection } from './useFirebaseCollection';
import { where, QueryConstraint } from 'firebase/firestore';
import { Department } from '@/components/module/submodules/departments/types';
import { fetchCollectionData } from './fetchCollectionData';
import { useEffect, useState } from 'react';

/**
 * Hook pour récupérer les départements depuis Firebase avec mise à jour en temps réel
 * @param companyId Optionnel - ID de l'entreprise pour filtrer les départements
 */
export const useFirebaseDepartments = (companyId?: string) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Préparer les contraintes de requête si un ID d'entreprise est fourni
  const queryConstraints: QueryConstraint[] = [];
  
  if (companyId) {
    queryConstraints.push(where('companyId', '==', companyId));
  }
  
  // Fetch departments on mount or when companyId changes
  useEffect(() => {
    async function fetchDepartments() {
      setIsLoading(true);
      try {
        console.log("Fetching departments from collection:", COLLECTIONS.HR.DEPARTMENTS);
        const fetchedDepartments = await fetchCollectionData<Department>(COLLECTIONS.HR.DEPARTMENTS, queryConstraints);
        console.log("Departments fetched:", fetchedDepartments);
        setDepartments(fetchedDepartments);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setError(err instanceof Error ? err : new Error("Unknown error fetching departments"));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchDepartments();
  }, [companyId]); // Re-fetch when companyId changes
  
  const refetch = async () => {
    setIsLoading(true);
    try {
      const fetchedDepartments = await fetchCollectionData<Department>(COLLECTIONS.HR.DEPARTMENTS, queryConstraints);
      setDepartments(fetchedDepartments);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error refetching departments"));
    } finally {
      setIsLoading(false);
    }
  };

  return { departments, isLoading, error, refetch };
};
