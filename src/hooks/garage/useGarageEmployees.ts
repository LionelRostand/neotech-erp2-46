
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Mechanic } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

export const useGarageEmployees = () => {
  // Ensure we have a valid collection path with fallback
  const collectionPath = COLLECTIONS.GARAGE?.MECHANICS || 'garage_mechanics';
  
  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: async () => {
      if (!collectionPath) {
        throw new Error('Collection path for mechanics is not defined');
      }
      
      console.log('Fetching mechanics from collection:', collectionPath);
      try {
        const mechanics = await fetchCollectionData<Mechanic>(collectionPath);
        console.log('Fetched mechanics:', mechanics);
        return mechanics;
      } catch (err: any) {
        console.error('Error fetching mechanics:', err);
        toast.error(`Erreur: ${err.message}`);
        return [];
      }
    },
  });

  return {
    employees,
    loading: isLoading,
    error
  };
};
