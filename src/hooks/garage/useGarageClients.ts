
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export interface GarageClient {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  customerSince?: string;
  lastVisit?: string;
  notes?: string;
}

export const useGarageClients = () => {
  const [clients, setClients] = useState<GarageClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        const clientsCollectionRef = collection(db, COLLECTIONS.GARAGE.CLIENTS);
        const snapshot = await getDocs(clientsCollectionRef);
        
        const clientsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GarageClient[];
        
        setClients(clientsData);
        setError(null);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des clients:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        
        // Provide default clients if we can't fetch from database
        setClients([
          {
            id: 'client1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            phone: '0612345678',
            address: '123 Rue Principale',
            city: 'Paris',
            zipCode: '75001',
            customerSince: '2021-01-15',
            lastVisit: '2023-06-10'
          },
          {
            id: 'client2',
            firstName: 'Marie',
            lastName: 'Lambert',
            email: 'marie.lambert@example.com',
            phone: '0723456789',
            address: '45 Avenue des Fleurs',
            city: 'Lyon',
            zipCode: '69002',
            customerSince: '2020-05-22',
            lastVisit: '2023-05-05'
          }
        ]);
        
        toast.error(`Erreur lors du chargement des clients: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  return {
    clients,
    isLoading,
    error
  };
};
