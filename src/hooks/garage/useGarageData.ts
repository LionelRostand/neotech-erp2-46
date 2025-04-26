
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
        return [
          { id: "mech1", firstName: "Pierre", lastName: "Martin", speciality: "Moteur" },
          { id: "mech2", firstName: "Sophie", lastName: "Leclerc", speciality: "Électronique" },
          { id: "mech3", firstName: "Jean", lastName: "Dupont", speciality: "Carrosserie" }
        ];
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
        return [
          { id: "client1", firstName: "Jean", lastName: "Dupont", email: "jean.dupont@example.com" },
          { id: "client2", firstName: "Marie", lastName: "Durand", email: "marie.durand@example.com" },
          { id: "client3", firstName: "Pierre", lastName: "Martin", email: "pierre.martin@example.com" }
        ];
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
        return [
          { id: "vehicle1", make: "Peugeot", model: "308", year: 2020, licensePlate: "AB-123-CD" },
          { id: "vehicle2", make: "Renault", model: "Clio", year: 2019, licensePlate: "EF-456-GH" },
          { id: "vehicle3", make: "Citroën", model: "C3", year: 2021, licensePlate: "IJ-789-KL" }
        ];
      }
    }
  });

  // Fetch maintenances data from garage_maintenances collection
  const { data: maintenances = [], isLoading: maintenancesLoading } = useQuery({
    queryKey: ['garage', 'maintenances'],
    queryFn: async () => {
      try {
        console.log("Fetching maintenances from collection 'garage_maintenances'");
        const snapshot = await getDocs(collection(db, 'garage_maintenances'));
        const results = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as GarageMaintenance[];
        console.log("Fetched maintenances:", results);
        
        return results.length > 0 ? results : [
          {
            id: "maint1",
            vehicleId: "vehicle1",
            clientId: "client1",
            mechanicId: "mech1",
            date: new Date().toISOString(),
            status: "scheduled",
            services: [
              { serviceId: "service1", quantity: 1, cost: 65 }
            ],
            totalCost: 65,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: "maint2",
            vehicleId: "vehicle2",
            clientId: "client2",
            mechanicId: "mech2",
            date: new Date().toISOString(),
            status: "completed",
            services: [
              { serviceId: "service2", quantity: 1, cost: 150 },
              { serviceId: "service5", quantity: 1, cost: 80 }
            ],
            totalCost: 230,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
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
    isLoading: servicesLoading || mechanicsLoading || clientsLoading || vehiclesLoading || maintenancesLoading
  };
};
