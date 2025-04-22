
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export interface FreightCarrier {
  id: string;
  name: string;
}

export const useFreightCarriers = () => {
  const { data: carriers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['freight', 'carriers'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.CARRIERS));
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
        } as FreightCarrier;
      });
    }
  });

  return {
    carriers,
    isLoading,
    error,
    refetchCarriers: refetch
  };
};
