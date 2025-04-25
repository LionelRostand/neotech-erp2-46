
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
        const result = await fetchCollectionData<Mechanic>(COLLECTIONS.GARAGE.MECHANICS);
        console.log('Mechanics fetched:', result);
        return result;
      } catch (err) {
        console.error('Error fetching mechanics:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // If there's an error, show a toast
  React.useEffect(() => {
    if (error) {
      toast.error(`Erreur lors du chargement des mécaniciens: ${error.message}`);
    }
  }, [error]);

  // Update mechanic function
  const updateMechanic = async (id: string, data: Partial<Mechanic>) => {
    // Implement update logic if needed
    console.log('Updating mechanic:', id, data);
  };

  // Delete mechanic function
  const deleteMechanic = async (id: string) => {
    // Implement delete logic if needed
    console.log('Deleting mechanic:', id);
  };

  return {
    mechanics,
    isLoading,
    error,
    updateMechanic,
    deleteMechanic,
    refetch
  };
};
