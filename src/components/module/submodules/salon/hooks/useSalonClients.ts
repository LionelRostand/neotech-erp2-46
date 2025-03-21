
import { useState, useEffect, useCallback } from 'react';
import { SalonClient } from '../types/salon-types';
import { toast } from 'sonner';

// Mock data for development
const mockClients: SalonClient[] = [
  {
    id: "client-001",
    firstName: "Emma",
    lastName: "Bernard",
    email: "emma.bernard@example.com",
    phone: "06 12 34 56 78",
    birthDate: "1985-05-12",
    address: "15 rue des Lilas, 75011 Paris",
    preferences: "Couleur naturelle, pas trop court",
    notes: "Cliente fidèle depuis 2018",
    preferredStylist: "Sophie Dupont",
    loyaltyPoints: 250,
    createdAt: "2018-03-15",
    lastVisit: "2023-05-10",
    visits: [
      {
        date: "2023-05-10",
        service: "Coupe + Coloration",
        stylist: "Sophie Dupont",
        price: 95,
        satisfaction: "Très satisfait",
        notes: "Très contente du résultat"
      },
      {
        date: "2023-03-02",
        service: "Brushing",
        stylist: "Marie Lefort",
        price: 35,
        satisfaction: "Satisfait",
        notes: ""
      }
    ],
    appointments: [
      {
        id: "apt-001",
        clientId: "client-001",
        service: "Coupe + Brushing",
        stylist: "Sophie Dupont",
        date: "2023-06-20",
        time: "14:30",
        duration: 60,
        status: "confirmed",
        notes: ""
      }
    ]
  },
  {
    id: "client-002",
    firstName: "Thomas",
    lastName: "Mercier",
    email: "thomas.mercier@example.com",
    phone: "06 23 45 67 89",
    birthDate: "1990-08-22",
    address: "8 avenue Victor Hugo, 75016 Paris",
    preferences: "Coupe classique, rasage à l'ancienne",
    notes: "Allergique à certains produits capillaires",
    preferredStylist: "Lucas Renard",
    loyaltyPoints: 120,
    createdAt: "2019-11-05",
    lastVisit: "2023-04-28",
    visits: [
      {
        date: "2023-04-28",
        service: "Coupe Homme + Barbe",
        stylist: "Lucas Renard",
        price: 45,
        satisfaction: "Très satisfait",
        notes: ""
      }
    ],
    appointments: []
  },
  {
    id: "client-003",
    firstName: "Sophie",
    lastName: "Petit",
    email: "sophie.petit@example.com",
    phone: "06 34 56 78 90",
    birthDate: "1978-02-14",
    address: "23 rue de la Paix, 75002 Paris",
    preferences: "Mèches blondes, cheveux mi-longs",
    notes: "",
    preferredStylist: "Isabelle Meyer",
    loyaltyPoints: 380,
    createdAt: "2017-06-30",
    lastVisit: "2023-05-15",
    visits: [
      {
        date: "2023-05-15",
        service: "Balayage + Coupe",
        stylist: "Isabelle Meyer",
        price: 120,
        satisfaction: "Très satisfait",
        notes: "Ravie du résultat"
      },
      {
        date: "2023-03-10",
        service: "Coupe + Brushing",
        stylist: "Isabelle Meyer",
        price: 55,
        satisfaction: "Satisfait",
        notes: ""
      }
    ],
    appointments: [
      {
        id: "apt-002",
        clientId: "client-003",
        service: "Coloration + Coupe",
        stylist: "Isabelle Meyer",
        date: "2023-06-25",
        time: "10:00",
        duration: 120,
        status: "pending",
        notes: "Souhaite changer de couleur"
      }
    ]
  },
  {
    id: "client-004",
    firstName: "Nicolas",
    lastName: "Dubois",
    email: "nicolas.dubois@example.com",
    phone: "06 45 67 89 01",
    birthDate: "1982-11-30",
    address: "5 place de la République, 75003 Paris",
    preferences: "Coupe courte, dégradé sur les côtés",
    notes: "Vient tous les mois",
    preferredStylist: "Lucas Renard",
    loyaltyPoints: 180,
    createdAt: "2020-01-15",
    lastVisit: "2023-05-02",
    visits: [
      {
        date: "2023-05-02",
        service: "Coupe Homme",
        stylist: "Lucas Renard",
        price: 25,
        satisfaction: "Satisfait",
        notes: ""
      }
    ],
    appointments: []
  },
  {
    id: "client-005",
    firstName: "Julie",
    lastName: "Moreau",
    email: "julie.moreau@example.com",
    phone: "06 56 78 90 12",
    birthDate: "1995-07-18",
    address: "12 rue Saint-Denis, 75001 Paris",
    preferences: "Cheveux longs, pas de coloration",
    notes: "Sensible du cuir chevelu",
    preferredStylist: "Sophie Dupont",
    loyaltyPoints: 90,
    createdAt: "2021-03-22",
    lastVisit: "2023-04-15",
    visits: [
      {
        date: "2023-04-15",
        service: "Coupe + Soin",
        stylist: "Sophie Dupont",
        price: 65,
        satisfaction: "Très satisfait",
        notes: ""
      }
    ],
    appointments: [
      {
        id: "apt-003",
        clientId: "client-005",
        service: "Coupe + Brushing",
        stylist: "Sophie Dupont",
        date: "2023-06-18",
        time: "16:00",
        duration: 60,
        status: "confirmed",
        notes: ""
      }
    ]
  }
];

export const useSalonClients = () => {
  const [clients, setClients] = useState<SalonClient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch clients
  useEffect(() => {
    const fetchClients = async () => {
      setIsLoading(true);
      try {
        // In a real app, use this:
        // const data = await getAllDocuments('salonClients');
        // setClients(data as SalonClient[]);
        
        // For mock data:
        setTimeout(() => {
          setClients(mockClients);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Add a new client
  const addClient = useCallback(async (clientData: Omit<SalonClient, 'id' | 'createdAt' | 'visits' | 'appointments'>) => {
    try {
      // In a real app, use this:
      // const newClient = await addDocument('salonClients', clientData);
      
      // For mock data:
      const newClient: SalonClient = {
        id: `client-${clients.length + 6}`.padStart(9, '0'),
        ...clientData,
        createdAt: new Date().toISOString(),
        lastVisit: null,
        visits: [],
        appointments: [],
        loyaltyPoints: 0
      };
      setClients(prev => [...prev, newClient]);
      toast("Client ajouté avec succès");
      return newClient;
    } catch (err) {
      toast("Erreur lors de l'ajout du client");
      console.error(err);
      throw err;
    }
  }, [clients]);

  // Update a client
  const updateClient = useCallback(async (clientData: SalonClient) => {
    try {
      // In a real app, use this:
      // await updateDocument('salonClients', clientData.id, clientData);
      
      // For mock data:
      setClients(prev => 
        prev.map(client => 
          client.id === clientData.id 
            ? { ...client, ...clientData } 
            : client
        )
      );
      toast("Client mis à jour avec succès");
    } catch (err) {
      toast("Erreur lors de la mise à jour du client");
      console.error(err);
    }
  }, []);

  // Delete a client
  const deleteClient = useCallback(async (id: string) => {
    try {
      // In a real app, use this:
      // await deleteDocument('salonClients', id);
      
      // For mock data:
      setClients(prev => prev.filter(client => client.id !== id));
      toast("Client supprimé avec succès");
    } catch (err) {
      toast("Erreur lors de la suppression du client");
      console.error(err);
    }
  }, []);

  return {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient
  };
};
