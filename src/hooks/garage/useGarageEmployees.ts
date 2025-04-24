
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Mechanic } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

export const useGarageEmployees = () => {
  // Ensure we have a valid collection path with multiple fallbacks
  const mechanicsPath = 
    (COLLECTIONS.GARAGE && COLLECTIONS.GARAGE.MECHANICS) || 
    (COLLECTIONS.GARAGE?.MECHANICS) || 
    'garage_mechanics';
  
  console.log('mechanicsPath:', mechanicsPath); // Debug log
  
  const { data: employees = [], isLoading } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: () => {
      // Double-check path before fetching
      if (!mechanicsPath || mechanicsPath.trim() === '') {
        console.error('Mechanics collection path is empty');
        toast.error('Erreur: Chemin de collection invalide');
        return [];
      }
      return fetchCollectionData<Mechanic>(mechanicsPath);
    },
  });

  return {
    employees,
    loading: isLoading
  };
};
