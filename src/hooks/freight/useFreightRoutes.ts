
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export interface FreightRoute {
  id: string;
  name: string;
  origin?: string;
  destination?: string;
  // Vous pouvez ajouter d'autres champs selon le schéma Firestore
}

export const useFreightRoutes = () => {
  const { data: routes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['freight', 'routes'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.ROUTES));
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          origin: data.origin || '',
          destination: data.destination || ''
        } as FreightRoute;
      });
    }
  });

  return {
    routes,
    isLoading,
    error,
    refetchRoutes: refetch
  };
};
