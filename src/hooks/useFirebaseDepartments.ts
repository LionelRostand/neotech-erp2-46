
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where, QueryConstraint, orderBy } from 'firebase/firestore';
import { Department } from '@/components/module/submodules/departments/types';
import { fetchCollectionData } from './fetchCollectionData';
import { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';

/**
 * Hook pour récupérer les départements depuis Firebase avec mise à jour en temps réel
 * @param companyId Optionnel - ID de l'entreprise pour filtrer les départements
 */
export const useFirebaseDepartments = (companyId?: string) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const previousCompanyId = useRef<string | undefined>(companyId);
  const isMounted = useRef(true);
  const hasInitialFetch = useRef(false);
  
  // Préparer les contraintes de requête si un ID d'entreprise est fourni
  const queryConstraints: QueryConstraint[] = [];
  
  if (companyId) {
    queryConstraints.push(where('companyId', '==', companyId));
  }

  // Trier par nom seulement (pas d'orderBy composé avec companyId pour éviter des erreurs d'index)
  queryConstraints.push(orderBy('name', 'asc'));
  
  const fetchDepartments = useCallback(async () => {
    // Prevent refetching with the same parameters
    if (!isMounted.current || (hasInitialFetch.current && previousCompanyId.current === companyId)) {
      return;
    }
    
    if (previousCompanyId.current !== companyId) {
      // Réinitialiser les départements lors du changement d'entreprise
      previousCompanyId.current = companyId;
      setDepartments([]);
    }

    setIsLoading(true);
    try {
      console.log("Fetching departments from collection:", COLLECTIONS.HR.DEPARTMENTS, companyId ? `for company ${companyId}` : 'for all companies');
      const fetchedDepartments = await fetchCollectionData<Department>(COLLECTIONS.HR.DEPARTMENTS, queryConstraints);
      
      if (!isMounted.current) return;
      
      // Ensure valid data with strict type checking
      if (!fetchedDepartments || !Array.isArray(fetchedDepartments)) {
        console.warn("Fetched departments is not an array:", fetchedDepartments);
        setDepartments([]);
        setIsLoading(false);
        hasInitialFetch.current = true;
        return;
      }
      
      // Dédupliquer les départements par ID
      const uniqueDepartments = new Map<string, Department>();
      
      // Process each department with safety checks
      fetchedDepartments.forEach(dept => {
        if (dept && typeof dept === 'object' && dept.id && typeof dept.id === 'string') {
          uniqueDepartments.set(dept.id, {
            ...dept,
            // Ensure all required fields exist
            name: dept.name || `Department ${dept.id.substring(0, 5)}`,
            description: dept.description || '',
            managerId: dept.managerId || '',
            managerName: dept.managerName || '',
            companyId: dept.companyId || companyId || '',
            color: dept.color || '#3b82f6',
            employeeIds: Array.isArray(dept.employeeIds) ? dept.employeeIds : [],
            employeesCount: typeof dept.employeesCount === 'number' ? dept.employeesCount : 0
          });
        }
      });
      
      const uniqueData = Array.from(uniqueDepartments.values());
      console.log(`Après déduplication: ${uniqueData.length} départements (avant: ${fetchedDepartments.length})`);
      
      setDepartments(uniqueData);
      setError(null);
      hasInitialFetch.current = true;
    } catch (err) {
      if (!isMounted.current) return;
      
      console.error("Error fetching departments:", err);
      setError(err instanceof Error ? err : new Error("Unknown error fetching departments"));
      // Always set a valid empty array in case of error
      setDepartments([]);
      
      // Don't show toast on initial error to avoid overwhelming the user
      if (hasInitialFetch.current) {
        toast.error("Erreur lors du chargement des départements");
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        hasInitialFetch.current = true;
      }
    }
  }, [companyId, queryConstraints]);
  
  // Fetch departments on mount or when companyId changes
  useEffect(() => {
    isMounted.current = true;
    fetchDepartments();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchDepartments]); // Re-fetch when companyId changes or query constraints update
  
  const refetch = useCallback(async () => {
    hasInitialFetch.current = false;
    return fetchDepartments();
  }, [fetchDepartments]);

  return { 
    departments: departments || [], // Ensure we always return an array
    isLoading, 
    error, 
    refetch 
  };
};
