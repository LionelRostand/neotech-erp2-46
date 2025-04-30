
import { useState, useEffect } from 'react';
import { companyService } from '@/components/module/submodules/companies/services/companyService';
import { Company } from '@/components/module/submodules/companies/types';

export const useCompaniesData = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await companyService.getCompanies();
        setCompanies(response.companies);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return {
    companies,
    isLoading,
    error
  };
};
