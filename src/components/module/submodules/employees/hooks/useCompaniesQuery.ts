
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Company } from '@/components/module/submodules/companies/types';

export const useCompaniesQuery = () => {
  return useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const companies = await fetchCollectionData<Company>(COLLECTIONS.COMPANIES);
      return companies;
    }
  });
};
