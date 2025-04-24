
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';

export interface GarageService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  status: 'active' | 'inactive';
}

export const useGarageServices = () => {
  const { data: services = [], isLoading, error } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: () => fetchCollectionData<GarageService>(COLLECTIONS.GARAGE.SERVICES)
  });

  return {
    services,
    isLoading,
    error
  };
};
