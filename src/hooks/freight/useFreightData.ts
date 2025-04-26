
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useFreightData = () => {
  const { data: containers = [], isLoading: containersLoading } = useQuery({
    queryKey: ['freight', 'containers'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.CONTAINERS));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  });

  const { data: shipments = [], isLoading: shipmentsLoading } = useQuery({
    queryKey: ['freight', 'shipments'],
    queryFn: async () => {
      const snapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.SHIPMENTS));
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  });

  return {
    containers,
    shipments,
    isLoading: containersLoading || shipmentsLoading
  };
};
