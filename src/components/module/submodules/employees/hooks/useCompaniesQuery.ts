
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
        if (response && Array.isArray(response.companies)) {
          return response.companies;
        } else if (response && Array.isArray(response)) {
          // Handle case where response might be the array directly
          return response;
        } else {
          console.warn("Companies data is not in expected format:", response);
          return [];
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        return [] as Company[]; // Return empty array on error
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
