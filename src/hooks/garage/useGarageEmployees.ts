
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Mechanic } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

export const useGarageEmployees = () => {
  // Ensure collection path is always valid
  const collectionPath = COLLECTIONS.GARAGE?.MECHANICS || 'garage_mechanics';
  
  const { data: employees = [], isLoading, error } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: async () => {
      console.log('Fetching mechanics from collection:', collectionPath);
      try {
        return await fetchCollectionData<Mechanic>(collectionPath);
      } catch (err: any) {
        console.error('Error fetching mechanics:', err);
        toast.error(`Erreur: ${err.message}`);
        return [];
      }
    },
  });

  // Add debug logging
  console.log('useGarageEmployees hook - mechanics count:', employees.length);
  if (error) {
    console.error('useGarageEmployees hook - error:', error);
  }

  return {
    employees,
    loading: isLoading,
    error
  };
};
