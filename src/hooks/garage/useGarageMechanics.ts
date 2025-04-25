
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Mechanic } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

export const useGarageMechanics = () => {
  const { 
    data: mechanics = [], 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: async () => {
      try {
        console.log('Fetching mechanics from collection:', COLLECTIONS.GARAGE.MECHANICS);
        const mechanicsData = await fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS);
        console.log('Mechanics fetched:', mechanicsData);
        return mechanicsData.map(mechanic => ({
          ...mechanic,
          displayName: `${mechanic.firstName} ${mechanic.lastName}`
        }));
      } catch (err) {
        console.error('Error fetching mechanics:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  React.useEffect(() => {
    if (error) {
      toast.error(`Erreur lors du chargement des mécaniciens: ${error.message}`);
    }
  }, [error]);

  return {
    mechanics,
    isLoading,
    error,
    refetch
  };
};
