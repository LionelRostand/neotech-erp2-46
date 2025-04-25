
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDoc, updateDoc, deleteDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { Repair } from '@/components/module/submodules/garage/types/garage-types';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: string;
  clientId: string;
  clientName?: string;
  licensePlate: string;
  vin?: string;
  color?: string;
  status?: string;
  maintenanceHistory?: any[];
  lastService?: string;
  nextService?: string;
  mileage?: number;
  notes?: string;
}

export interface GarageClient {
  id: string;
  name: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
  vehicles?: Vehicle[];
  createdAt?: string;
  updatedAt?: string;
}

export const useGarageData = () => {
  const queryClient = useQueryClient();
  
  // Récupération des clients
  const { data: clients = [], isLoading: isClientsLoading } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(COLLECTIONS.GARAGE.CLIENTS),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
  
  // Récupération des véhicules
  const { data: vehicles = [], isLoading: isVehiclesLoading } = useQuery({
    queryKey: ['garage', 'vehicles'],
    queryFn: () => fetchCollectionData<Vehicle>(COLLECTIONS.GARAGE.VEHICLES),
    staleTime: 5 * 60 * 1000,
  });
  
  // Récupération des réparations
  const { data: repairs = [], isLoading: isRepairsLoading } = useQuery({
    queryKey: ['garage', 'repairs'],
    queryFn: () => fetchCollectionData<Repair>(COLLECTIONS.GARAGE.REPAIRS),
    staleTime: 5 * 60 * 1000,
  });

  // Mutation pour ajouter une réparation
  const addRepair = useMutation({
    mutationFn: async (newRepair: Omit<Repair, 'id'>) => {
      const repairsCollectionRef = collection(db, COLLECTIONS.GARAGE.REPAIRS);
      const docRef = await addDoc(repairsCollectionRef, newRepair);
      return { id: docRef.id, ...newRepair };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'repairs'] });
      toast.success('Réparation ajoutée avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de l\'ajout de la réparation:', error);
      toast.error('Erreur lors de l\'ajout de la réparation');
    }
  });

  // Mutation pour mettre à jour une réparation
  const updateRepair = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Repair> }) => {
      const repairRef = doc(db, COLLECTIONS.GARAGE.REPAIRS, id);
      await updateDoc(repairRef, data);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'repairs'] });
      toast.success('Réparation mise à jour avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour de la réparation:', error);
      toast.error('Erreur lors de la mise à jour de la réparation');
    }
  });

  // Mutation pour supprimer une réparation
  const deleteRepair = useMutation({
    mutationFn: async (id: string) => {
      const repairRef = doc(db, COLLECTIONS.GARAGE.REPAIRS, id);
      await deleteDoc(repairRef);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'repairs'] });
      toast.success('Réparation supprimée avec succès');
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression de la réparation:', error);
      toast.error('Erreur lors de la suppression de la réparation');
    }
  });

  const isLoading = isClientsLoading || isVehiclesLoading || isRepairsLoading;
  
  return {
    clients,
    vehicles,
    repairs,
    isLoading,
    refetch: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'repairs'] });
      queryClient.invalidateQueries({ queryKey: ['garage', 'clients'] });
      queryClient.invalidateQueries({ queryKey: ['garage', 'vehicles'] });
    },
    addRepair,
    updateRepair,
    deleteRepair
  };
};
