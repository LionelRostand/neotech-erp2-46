
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export interface FreightClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt?: any;
}

export const useFreightClients = () => {
  const { data: clients = [], isLoading, error, refetch } = useQuery({
    queryKey: ['freight', 'clients'],
    queryFn: async () => {
      console.log('Fetching freight clients...');
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.CLIENTS));
      
      const clientsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        const client = {
          id: doc.id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          notes: data.notes || '',
          createdAt: data.createdAt || null
        } as FreightClient;
        
        console.log('Loaded client:', client.id, client.name);
        return client;
      });
      
      console.log(`Freight clients loaded: ${clientsData.length} clients`);
      return clientsData;
    }
  });

  return {
    clients,
    isLoading,
    error,
    refetchClients: refetch
  };
};
