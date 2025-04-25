
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Service } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageServices = () => {
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData<Service>(COLLECTIONS.GARAGE.SERVICES),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  return {
    services,
    isLoading,
    error
  };
};
