
import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageData = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const fetchGarageData = async () => {
      setIsLoading(true);
      try {
        // Fetch vehicles
        const vehiclesRef = collection(db, COLLECTIONS.GARAGE.VEHICLES);
        const vehiclesSnapshot = await getDocs(vehiclesRef);
        const vehiclesData = vehiclesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setVehicles(vehiclesData as Vehicle[]);
        
        // Fetch maintenance
        const maintenanceRef = collection(db, COLLECTIONS.GARAGE.MAINTENANCE);
        const maintenanceSnapshot = await getDocs(maintenanceRef);
        const maintenanceData = maintenanceSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMaintenance(maintenanceData);
        
        // Fetch clients
        const clientsRef = collection(db, COLLECTIONS.GARAGE.CLIENTS);
        const clientsSnapshot = await getDocs(clientsRef);
        const clientsData = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setClients(clientsData);
        
        // Fetch mechanics
        const mechanicsRef = collection(db, COLLECTIONS.GARAGE.MECHANICS);
        const mechanicsSnapshot = await getDocs(mechanicsRef);
        const mechanicsData = mechanicsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setMechanics(mechanicsData);
        
      } catch (error: any) {
        console.error("Error fetching garage data:", error);
        setError(error instanceof Error ? error : new Error('An unknown error occurred'));
        toast.error(`Erreur lors du chargement des données: ${error.message}`);
        
        // Set default data for development/testing
        setVehicles([
          {
            id: "1",
            make: "Peugeot",
            model: "308",
            registrationNumber: "AB-123-CD",
            clientId: "client1",
            mileage: 45000,
            status: "active",
            lastCheckDate: "2023-04-15"
          },
          {
            id: "2",
            make: "Renault",
            model: "Clio",
            registrationNumber: "EF-456-GH",
            clientId: "client2",
            mileage: 28000,
            status: "active",
            lastCheckDate: "2023-06-20"
          },
          {
            id: "3",
            make: "Citroen",
            model: "C3",
            registrationNumber: "IJ-789-KL",
            clientId: "client1",
            mileage: 62000,
            status: "maintenance",
            lastCheckDate: "2023-02-10"
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGarageData();
  }, []);
  
  return {
    vehicles,
    maintenance,
    clients,
    mechanics,
    isLoading,
    error
  };
};
