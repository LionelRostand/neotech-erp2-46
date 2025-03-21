
import { useState, useEffect } from 'react';
import { SalonClient } from '../types/salon-types';
import { useFirestore } from '@/hooks/use-firestore';

const MOCK_CLIENTS: SalonClient[] = [
  {
    id: '1',
    firstName: 'Marie',
    lastName: 'Dupont',
    email: 'marie.dupont@example.com',
    phone: '06 12 34 56 78',
    birthDate: '1985-04-15',
    address: '15 rue des Lilas, 75011 Paris',
    preferences: 'Préfère les colorations naturelles, sensible au cuir chevelu',
    notes: 'Fidèle depuis 2018',
    preferredStylist: 'alexandra',
    loyaltyPoints: 75,
    createdAt: '2018-05-10T14:30:00Z',
    lastVisit: '2023-06-20T10:15:00Z',
    visits: [
      {
        date: '2023-06-20T10:15:00Z',
        service: 'Coupe et brushing',
        stylist: 'Alexandra',
        price: 55,
        satisfaction: 'Très satisfait'
      },
      {
        date: '2023-04-05T14:30:00Z',
        service: 'Coloration complète',
        stylist: 'Alexandra',
        price: 75,
        satisfaction: 'Satisfait'
      },
      {
        date: '2023-01-12T11:00:00Z',
        service: 'Coupe et couleur',
        stylist: 'Nicolas',
        price: 95,
        satisfaction: 'Très satisfait'
      }
    ],
    appointments: [
      {
        id: 'a1',
        date: '2023-09-15T10:00:00Z',
        service: 'Coupe et brushing',
        stylist: 'Alexandra',
        status: 'confirmed',
        duration: 60
      }
    ]
  },
  {
    id: '2',
    firstName: 'Thomas',
    lastName: 'Martin',
    email: 'thomas.martin@example.com',
    phone: '06 98 76 54 32',
    birthDate: '1990-08-22',
    address: '8 avenue Victor Hugo, 75016 Paris',
    preferences: 'Coupe courte, pas de produits',
    notes: 'Client occasionnel',
    preferredStylist: 'nicolas',
    loyaltyPoints: 25,
    createdAt: '2022-03-15T09:45:00Z',
    lastVisit: '2023-05-10T16:30:00Z',
    visits: [
      {
        date: '2023-05-10T16:30:00Z',
        service: 'Coupe homme',
        stylist: 'Nicolas',
        price: 28,
        satisfaction: 'Satisfait'
      },
      {
        date: '2023-02-18T11:30:00Z',
        service: 'Coupe homme',
        stylist: 'Thomas',
        price: 28,
        satisfaction: 'Satisfait'
      }
    ],
    appointments: []
  },
  {
    id: '3',
    firstName: 'Julie',
    lastName: 'Petit',
    email: 'julie.petit@example.com',
    phone: '07 45 67 89 10',
    birthDate: '1988-11-30',
    address: '22 rue de la Paix, 75002 Paris',
    preferences: 'Aime les coupes modernes, allergique à l\'ammoniaque',
    notes: 'Très sensible au cuir chevelu',
    preferredStylist: 'sophie',
    loyaltyPoints: 120,
    createdAt: '2020-01-20T11:15:00Z',
    lastVisit: '2023-07-05T14:00:00Z',
    visits: [
      {
        date: '2023-07-05T14:00:00Z',
        service: 'Balayage et coupe',
        stylist: 'Sophie',
        price: 120,
        satisfaction: 'Très satisfait'
      },
      {
        date: '2023-04-22T10:30:00Z',
        service: 'Coupe et brushing',
        stylist: 'Sophie',
        price: 55,
        satisfaction: 'Très satisfait'
      },
      {
        date: '2023-02-08T16:15:00Z',
        service: 'Coloration',
        stylist: 'Sophie',
        price: 65,
        satisfaction: 'Satisfait'
      }
    ],
    appointments: [
      {
        id: 'a2',
        date: '2023-10-12T15:30:00Z',
        service: 'Balayage et coupe',
        stylist: 'Sophie',
        status: 'pending',
        duration: 120
      }
    ]
  }
];

export const useSalonClients = () => {
  const [clients, setClients] = useState<SalonClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { getAll, add, update, remove } = useFirestore('salon-clients');
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        // Here we would normally fetch from Firebase, but we'll use mock data for now
        // const data = await getAll();
        setClients(MOCK_CLIENTS);
      } catch (err) {
        setError(err as Error);
        console.error('Error fetching clients:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchClients();
  }, []);
  
  const addClient = async (client: SalonClient) => {
    try {
      // Here we would normally add to Firebase
      // const newClient = await add(client);
      setClients(prevClients => [...prevClients, client]);
      return client;
    } catch (err) {
      setError(err as Error);
      console.error('Error adding client:', err);
      throw err;
    }
  };
  
  const updateClient = async (client: SalonClient) => {
    try {
      // Here we would normally update in Firebase
      // await update(client.id, client);
      setClients(prevClients =>
        prevClients.map(c => c.id === client.id ? client : c)
      );
      return client;
    } catch (err) {
      setError(err as Error);
      console.error('Error updating client:', err);
      throw err;
    }
  };
  
  const deleteClient = async (clientId: string) => {
    try {
      // Here we would normally delete from Firebase
      // await remove(clientId);
      setClients(prevClients => prevClients.filter(c => c.id !== clientId));
      return true;
    } catch (err) {
      setError(err as Error);
      console.error('Error deleting client:', err);
      throw err;
    }
  };
  
  return {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient
  };
};
