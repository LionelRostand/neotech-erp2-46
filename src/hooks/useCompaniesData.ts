
import { useState, useEffect } from 'react';
import { companyService } from '@/components/module/submodules/companies/services/companyService';
import { Company } from '@/components/module/submodules/companies/types';
import { toast } from 'sonner';
import { useFirebaseCompanies } from './useFirebaseCompanies';

export const useCompaniesData = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Use the Firebase hook to get real companies data
  const { companies: firebaseCompanies, isLoading: isLoadingFirebase, error: firebaseError } = useFirebaseCompanies();

  useEffect(() => {
    // First try to use Firebase data
    if (firebaseCompanies && firebaseCompanies.length > 0) {
      setCompanies(firebaseCompanies);
      setIsLoading(false);
      return;
    }
    
    // If no Firebase data, try using the companyService as fallback
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await companyService.getCompanies();
        // Ensure we handle potentially undefined companies properly
        setCompanies(response?.companies || []);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        toast.error("Erreur lors du chargement des entreprises");
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if Firebase data isn't available
    if (isLoadingFirebase) {
      return; // Wait for Firebase to complete first
    }
    
    fetchCompanies();
  }, [firebaseCompanies, isLoadingFirebase]);

  return {
    companies: companies || [], // Ensure we always return an array even if companies is undefined
    isLoading: isLoading || isLoadingFirebase,
    error: error || firebaseError
  };
};
