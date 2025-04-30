
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where, QueryConstraint } from 'firebase/firestore';
import { Department } from '@/components/module/submodules/departments/types';
import { fetchCollectionData } from './fetchCollectionData';
import { deduplicateDepartments } from '@/components/module/submodules/departments/utils/departmentUtils';
import { useEffect, useState, useCallback, useRef } from 'react';

/**
 * Hook pour récupérer les départements depuis Firebase avec mise à jour en temps réel
 * @param companyId Optionnel - ID de l'entreprise pour filtrer les départements
 */
export const useFirebaseDepartments = (companyId?: string) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Cache control
  const cacheRef = useRef({
    data: null as Department[] | null,
    timestamp: 0,
    // Cache expiration time (5 minutes)
    EXPIRATION_TIME: 5 * 60 * 1000,
    isFetching: false
  });
  
  // Préparer les contraintes de requête si un ID d'entreprise est fourni
  const queryConstraints: QueryConstraint[] = [];
  
  if (companyId) {
    queryConstraints.push(where('companyId', '==', companyId));
  }
  
  const fetchDepartments = useCallback(async (forceRefresh = false) => {
    // Prevent concurrent fetches
    if (cacheRef.current.isFetching) return;
    
    const now = Date.now();
    const isCacheValid = cacheRef.current.data && 
                         (now - cacheRef.current.timestamp < cacheRef.current.EXPIRATION_TIME);
    
    // Use cache if valid and not forcing refresh
    if (isCacheValid && !forceRefresh) {
      setDepartments(cacheRef.current.data || []);
      setIsLoading(false);
      return;
    }
    
    // Set fetching flag
    cacheRef.current.isFetching = true;
    setIsLoading(true);
    
    try {
      console.log("Fetching departments from Firebase collection:", COLLECTIONS.HR.DEPARTMENTS);
      const fetchedDepartments = await fetchCollectionData<Department>(COLLECTIONS.HR.DEPARTMENTS, queryConstraints);
      
      // Deduplicate departments
      const uniqueData = deduplicateDepartments(fetchedDepartments);
      console.log(`Après déduplication: ${uniqueData.length} départements (avant: ${fetchedDepartments.length})`);
      
      // Update state and cache
      setDepartments(uniqueData);
      cacheRef.current.data = uniqueData;
      cacheRef.current.timestamp = now;
      setError(null);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError(err instanceof Error ? err : new Error("Unknown error fetching departments"));
    } finally {
      setIsLoading(false);
      cacheRef.current.isFetching = false;
    }
  }, [companyId, queryConstraints]);
  
  // Fetch departments on mount or when dependencies change
  useEffect(() => {
    fetchDepartments();
    // Cleanup function
    return () => {
      // Cancel any pending operations if component unmounts
    };
  }, [fetchDepartments]); // Only re-fetch when fetchDepartments changes (which depends on companyId and queryConstraints)
  
  const refetch = useCallback(() => {
    return fetchDepartments(true);
  }, [fetchDepartments]);

  return { departments, isLoading, error, refetch };
};
