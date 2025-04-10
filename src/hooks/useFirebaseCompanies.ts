
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Company } from '@/components/module/submodules/companies/types';
import { useFirebaseCollection } from './useFirebaseCollection';

/**
 * Hook pour récupérer les entreprises depuis Firebase avec mise à jour en temps réel
 */
export const useFirebaseCompanies = () => {
  const { 
    data: companies, 
    isLoading, 
    error, 
    refetch 
  } = useFirebaseCollection<Company>(COLLECTIONS.COMPANIES);

  return { companies, isLoading, error, refetch };
};
