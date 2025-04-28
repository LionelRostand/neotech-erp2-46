import { COLLECTIONS } from '@/lib/firebase-collections';
import { where, QueryConstraint } from 'firebase/firestore';
import { Department } from '@/components/module/submodules/departments/types';
import { fetchCollectionData } from './fetchCollectionData';
import { useEffect, useState, useCallback } from 'react';

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
  
  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Fetching departments from collection:", COLLECTIONS.HR.DEPARTMENTS);
      const fetchedDepartments = await fetchCollectionData<Department>(COLLECTIONS.HR.DEPARTMENTS, queryConstraints);
      console.log("Departments fetched:", fetchedDepartments);
      
      // Ensure valid data
      if (!Array.isArray(fetchedDepartments)) {
        console.warn("Fetched departments is not an array:", fetchedDepartments);
        setDepartments([]);
        return;
      }
      
      // Dédupliquer les départements par ID
      const uniqueDepartments = new Map<string, Department>();
      fetchedDepartments.forEach(dept => {
        if (dept && dept.id && !uniqueDepartments.has(dept.id)) {
          uniqueDepartments.set(dept.id, dept);
        }
      });
      
      const uniqueData = Array.from(uniqueDepartments.values());
      console.log(`Après déduplication: ${uniqueData.length} départements (avant: ${fetchedDepartments.length})`);
      
      setDepartments(uniqueData);
      setError(null);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err instanceof Error ? err : new Error("Unknown error fetching departments"));
    } finally {
      setIsLoading(false);
    }
  }, [companyId, queryConstraints]);
  
  // Fetch departments on mount or when companyId changes
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]); // Re-fetch when companyId changes
  
  const refetch = async () => {
    await fetchDepartments();
  };

  return { 
    departments, 
    isLoading, 
    error, 
    refetch 
  };
};
