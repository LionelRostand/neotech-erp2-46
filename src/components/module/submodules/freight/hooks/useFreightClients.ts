
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface FreightClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
}

export const useFreightClients = () => {
  const { data: clients = [], isLoading, error, refetch } = useQuery({
    queryKey: ['freight', 'clients'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.CLIENTS));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FreightClient[];
    }
  });

  return {
    clients,
    isLoading,
    error,
    refetchClients: refetch
  };
};
