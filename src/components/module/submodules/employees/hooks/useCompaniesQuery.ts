
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Company } from '@/components/module/submodules/companies/types';

export const useCompaniesQuery = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      try {
        console.log('Fetching companies data...');
        
        // S'assurer que le chemin de collection est valide
        if (!COLLECTIONS.COMPANIES) {
          console.error('Invalid companies collection path');
          return [];
        }
        
        const companies = await fetchCollectionData<Company>(COLLECTIONS.COMPANIES);
        // Ensure all companies have required fields to avoid undefined errors
        return companies.map(company => ({
          id: company.id || '',
          name: company.name || 'Sans nom',
          industry: company.industry || '',
          status: company.status || 'active',
          // Ensure other fields have default values if needed
          ...company
        }));
      } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
      }
    }
  });
};
