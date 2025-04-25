
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Mechanic } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageMechanics = () => {
  const { data: mechanics = [], isLoading, error } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  return {
    mechanics,
    isLoading,
    error
  };
};
