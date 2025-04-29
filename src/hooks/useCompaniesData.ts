
import { useState, useEffect } from 'react';
import { companyService } from '@/components/module/submodules/companies/services/companyService';
import { Company } from '@/components/module/submodules/companies/types';
import { toast } from 'sonner';

export const useCompaniesData = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
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

    fetchCompanies();
  }, []);

  return {
    companies: companies || [], // Ensure we always return an array even if companies is undefined
    isLoading,
    error
  };
};
