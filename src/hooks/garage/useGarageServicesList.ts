
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export interface GarageService {
  id: string;
  name: string;
  description?: string;
  duration?: number;
  cost: number;
  category?: string;
  createdAt?: string;
}

export const useGarageServicesList = () => {
  const [services, setServices] = useState<GarageService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch services from Firestore
  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const servicesCollectionRef = collection(db, COLLECTIONS.GARAGE.SERVICES);
        const snapshot = await getDocs(servicesCollectionRef);
        
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as GarageService[];
        
        setServices(servicesData);
        setError(null);
      } catch (err: any) {
        console.error("Erreur lors de la récupération des services:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        
        // Provide default services if we can't fetch from database
        setServices([
          { id: '1', name: 'Vidange', description: 'Vidange huile et filtre', duration: 60, cost: 89.99, category: 'Entretien' },
          { id: '2', name: 'Freins avant', description: 'Remplacement plaquettes', duration: 90, cost: 149.99, category: 'Réparation' },
          { id: '3', name: 'Freins arrière', description: 'Remplacement plaquettes', duration: 90, cost: 129.99, category: 'Réparation' },
          { id: '4', name: 'Pneus', description: 'Changement de pneus (unité)', duration: 30, cost: 25, category: 'Pneus' },
          { id: '5', name: 'Révision complète', description: 'Contrôle technique préventif', duration: 120, cost: 199.99, category: 'Entretien' },
        ]);
        
        toast.error(`Erreur lors du chargement des services: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServices();
  }, []);
  
  // Create options for select inputs
  const servicesOptions = services.map(service => ({
    value: service.id,
    label: `${service.name} (${service.cost}€)`,
  }));
  
  return {
    services,
    servicesOptions,
    isLoading,
    error
  };
};
