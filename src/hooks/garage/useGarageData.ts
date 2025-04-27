
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export interface GarageService {
  id: string;
  name: string;
  cost: number;
  description?: string;
  category?: string;
  duration?: number;
}

export interface GarageMaintenance {
  id: string;
  vehicleId: string;
  clientId: string;
  mechanicId: string;
  date: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  services: Array<{
    serviceId: string;
    quantity: number;
    cost: number;
  }>;
  totalCost: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const useGarageData = () => {
  // Fetch garage services
  const { data: services = [], isLoading: servicesLoading } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: async () => {
      try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.GARAGE.SERVICES));
        return snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as GarageService));
      } catch (error) {
        console.error("Error fetching garage services:", error);
        // Return some default services for development
        return [
          { id: "service1", name: "Vidange d'huile", cost: 65, description: "Changement d'huile moteur et filtre", duration: 30 },
          { id: "service2", name: "Changement de freins", cost: 150, description: "Remplacement des plaquettes de frein", duration: 60 },
          { id: "service3", name: "Révision complète", cost: 250, description: "Révision générale du véhicule", duration: 120 },
          { id: "service4", name: "Changement de pneus", cost: 40, description: "Montage et équilibrage par pneu", duration: 45 },
          { id: "service5", name: "Diagnostic complet", cost: 80, description: "Diagnostic électronique complet", duration: 60 },
        ];
      }
    }
  });

  // Fetch mechanics data
  const { data: mechanics = [], isLoading: mechanicsLoading } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: async () => {
      try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.GARAGE.MECHANICS));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching mechanics:", error);
        return [];
      }
    }
  });

  // Fetch clients data
  const { data: clients = [], isLoading: clientsLoading } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: async () => {
      try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.GARAGE.CLIENTS));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching clients:", error);
        return [];
      }
    }
  });

  // Fetch vehicles data
  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: async () => {
      try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.GARAGE.VEHICLES));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        return [];
      }
    }
  });

  // Add maintenance query
  const { 
    data: maintenances = [], 
    isLoading: maintenancesLoading,
    refetch: refetchMaintenances 
  } = useQuery({
    queryKey: ['garage', 'maintenances'],
    queryFn: async () => {
      try {
        console.log("Fetching maintenances from Firestore...");
        const collectionPath = COLLECTIONS.GARAGE.MAINTENANCE || 'garage_maintenances';
        console.log("Collection path:", collectionPath);
        
        const snapshot = await getDocs(collection(db, collectionPath));
        console.log("Maintenance snapshot size:", snapshot.size);
        
        const maintenancesList = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as GarageMaintenance[];
        
        console.log("Maintenances fetched:", maintenancesList);
        return maintenancesList;
      } catch (error) {
        console.error("Error fetching maintenances:", error);
        return [];
      }
    }
  });

  return {
    services,
    mechanics,
    clients,
    vehicles,
    maintenances,
    isLoading: servicesLoading || mechanicsLoading || clientsLoading || vehiclesLoading || maintenancesLoading,
    refetch: refetchMaintenances
  };
};
