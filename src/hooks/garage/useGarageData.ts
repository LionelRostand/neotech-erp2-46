
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const useGarageData = () => {
  // Récupération des véhicules
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'garage_vehicles'));
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error loading vehicles:", error);
        return [];
      }
    }
  });

  // Récupération des services
  const { data: services = [], isLoading: isLoadingServices } = useQuery({
    queryKey: ['garage', 'services'],
    queryFn: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'garage_services'));
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error loading services:", error);
        return [];
      }
    }
  });

  // Récupération des mécaniciens
  const { data: mechanics = [], isLoading: isLoadingMechanics } = useQuery({
    queryKey: ['garage', 'mechanics'],
    queryFn: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'garage_mechanics'));
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error loading mechanics:", error);
        return [];
      }
    }
  });

  // Récupération des clients
  const { data: clients = [], isLoading: isLoadingClients } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'garage_clients'));
        return querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (error) {
        console.error("Error loading clients:", error);
        return [];
      }
    }
  });

  const { data: maintenances = [], isLoading: isLoadingMaintenances } = useQuery({
    queryKey: ['garage', 'maintenances'],
    queryFn: async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'garage_maintenances'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          // Ensure services is always an array
          services: Array.isArray(doc.data().services) ? doc.data().services : [],
        }));
        return data;
      } catch (error) {
        console.error("Error loading maintenances:", error);
        return [];
      }
    }
  });

  const isLoading = isLoadingVehicles || isLoadingServices || isLoadingMechanics || isLoadingClients || isLoadingMaintenances;

  return {
    vehicles,
    services, 
    mechanics,
    clients,
    maintenances,
    isLoading
  };
};
