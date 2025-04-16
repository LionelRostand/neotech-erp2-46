
import { useState, useEffect } from 'react';
import { companyService } from '@/components/module/submodules/companies/services/companyService';
import { Company } from '@/components/module/submodules/companies/types';
import { useFirebaseCompanies } from './useFirebaseCompanies';

export const useCompaniesData = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Utiliser le hook useFirebaseCompanies qui récupère les données directement depuis Firestore
  const { companies: firebaseCompanies, isLoading: isFirebaseLoading } = useFirebaseCompanies();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // Si les données Firestore sont déjà chargées, les utiliser
        if (firebaseCompanies && firebaseCompanies.length > 0) {
          console.log("Using companies from Firebase:", firebaseCompanies);
          setCompanies(firebaseCompanies);
          setIsLoading(false);
          return;
        }
        
        console.log("Fetching companies from service...");
        setIsLoading(true);
        const response = await companyService.getCompanies();
        console.log("Companies from API:", response.companies);
        setCompanies(response.companies);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching companies:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, [firebaseCompanies]);

  return {
    companies,
    isLoading,
    error
  };
};
