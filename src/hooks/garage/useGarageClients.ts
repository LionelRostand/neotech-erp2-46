
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const useGarageClients = () => {
  const { 
    data: clients = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: async () => {
      try {
        return await fetchCollectionData(COLLECTIONS.GARAGE.CLIENTS);
      } catch (err) {
        console.error('Error fetching clients:', err);
        toast.error('Erreur lors du chargement des clients');
        return [];
      }
    }
  });

  return {
    clients,
    isLoading,
    error,
    refetch
  };
};
