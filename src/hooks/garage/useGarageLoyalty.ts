
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { LoyaltyProgram } from '../module/submodules/garage/types/loyalty-types';

export const useGarageLoyalty = () => {
  const { 
    data: loyalty, 
    isLoading, 
    error,
    refetch 
  } = useFirebaseCollection<LoyaltyProgram>(COLLECTIONS.GARAGE.LOYALTY);

  const activePrograms = loyalty.filter(program => program.status === 'active');
  const upcomingPrograms = loyalty.filter(program => program.status === 'upcoming');
  const inactivePrograms = loyalty.filter(program => program.status === 'inactive');

  return {
    loyalty,
    activePrograms,
    upcomingPrograms,
    inactivePrograms,
    isLoading,
    error,
    refetch
  };
};
