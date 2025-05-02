
import { useQuery } from '@tanstack/react-query';
import { companyService } from '../../companies/services/companyService';
import { Company } from '../../companies/types';

export const useCompaniesQuery = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      try {
        const response = await companyService.getCompanies();
        // Ensure we always return a valid array of companies
        return Array.isArray(response.companies) ? response.companies : [];
      } catch (error) {
        console.error("Error fetching companies:", error);
        // Return empty array if there's an error
        return [] as Company[];
      }
    }
  });

  return {
    data: Array.isArray(data) ? data : [],
    isLoading,
    error,
    refetch
  };
};
