
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where, QueryConstraint, orderBy } from 'firebase/firestore';
import { Department } from '@/components/module/submodules/departments/types';
import { fetchCollectionData } from './fetchCollectionData';
import { useEffect, useState, useCallback, useRef } from 'react';

// Cache for department data to reduce redundant fetches
const departmentsCache = new Map<string, {
  data: Department[];
  timestamp: number;
}>();

/**
 * Hook pour récupérer les départements depuis Firebase avec mise en cache
 * @param companyId Optionnel - ID de l'entreprise pour filtrer les départements
 */
export const useFirebaseDepartments = (companyId?: string) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  const previousCompanyId = useRef<string | undefined>(companyId);
  const hasInitialFetch = useRef(false);
  
  // Préparer les contraintes de requête si un ID d'entreprise est fourni
  const queryConstraints: QueryConstraint[] = [];
  
  if (companyId) {
    queryConstraints.push(where('companyId', '==', companyId));
  }

  queryConstraints.push(orderBy('name', 'asc'));
  
  // Generate cache key based on company id
  const cacheKey = companyId || 'all-departments';
  
  const fetchDepartments = useCallback(async () => {
    // Prevent refetching with the same parameters or when component is unmounted
    if (!isMounted.current || (hasInitialFetch.current && previousCompanyId.current === companyId)) {
      return;
    }
    
    // Check cache first
    const cachedData = departmentsCache.get(cacheKey);
    const now = Date.now();
    
    // Use cached data if available and less than 5 minutes old
    if (cachedData && (now - cachedData.timestamp < 5 * 60 * 1000)) {
      console.log(`Using cached departments data for key: ${cacheKey}`);
      setDepartments(cachedData.data);
      setIsLoading(false);
      hasInitialFetch.current = true;
      previousCompanyId.current = companyId;
      return;
    }
    
    // If company ID changed, reset state before fetching
    if (previousCompanyId.current !== companyId) {
      setDepartments([]);
      previousCompanyId.current = companyId;
    }

    setIsLoading(true);
    try {
      console.log("Fetching departments:", companyId ? `for company ${companyId}` : 'all departments');
      const fetchedDepartments = await fetchCollectionData<Department>(COLLECTIONS.HR.DEPARTMENTS, queryConstraints, 60000);
      
      if (!isMounted.current) return;
      
      // Validate and normalize the data
      const validDepartments = Array.isArray(fetchedDepartments) 
        ? fetchedDepartments
            .filter(dept => dept && typeof dept === 'object')
            .map(dept => ({
              id: dept.id || `dept-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              name: dept.name || `Département ${dept.id?.substring(0, 5) || ''}`,
              description: dept.description || '',
              managerId: dept.managerId || '',
              managerName: dept.managerName || '',
              companyId: dept.companyId || companyId || '',
              color: dept.color || '#3b82f6',
              employeeIds: Array.isArray(dept.employeeIds) ? dept.employeeIds : [],
              employeesCount: typeof dept.employeesCount === 'number' ? dept.employeesCount : 0
            } as Department))
        : [];
      
      // Update cache
      departmentsCache.set(cacheKey, {
        data: validDepartments,
        timestamp: now
      });
      
      setDepartments(validDepartments);
      setError(null);
      hasInitialFetch.current = true;
    } catch (err) {
      if (!isMounted.current) return;
      
      console.error("Error fetching departments:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch departments"));
      
      // Use expired cache as fallback if available
      if (cachedData) {
        console.log("Using expired cache as fallback");
        setDepartments(cachedData.data);
      } else {
        setDepartments([]);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [companyId, queryConstraints, cacheKey]);
  
  useEffect(() => {
    isMounted.current = true;
    fetchDepartments();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchDepartments]);
  
  const refetch = useCallback(() => {
    // Clear cache entry for this specific query
    departmentsCache.delete(cacheKey);
    hasInitialFetch.current = false;
    return fetchDepartments();
  }, [fetchDepartments, cacheKey]);

  return { 
    departments, 
    isLoading, 
    error, 
    refetch 
  };
};
