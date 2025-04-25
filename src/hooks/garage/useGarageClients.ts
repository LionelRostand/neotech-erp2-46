
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { addDoc, updateDoc, deleteDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { GarageClient } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageClients = () => {
  const queryClient = useQueryClient();
  
  // Fetch clients data
  const { data: clients = [], isLoading, error, refetch } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(COLLECTIONS.GARAGE.CLIENTS),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Add a new client
  const addClient = useMutation({
    mutationFn: async (newClient: Omit<GarageClient, 'id'>) => {
      try {
        // Correction: Use collection() instead of doc() for the collection reference
        const collectionRef = collection(db, COLLECTIONS.GARAGE.CLIENTS);
        const docRef = await addDoc(collectionRef, {
          ...newClient,
          createdAt: new Date().toISOString(),
        });
        return { id: docRef.id, ...newClient };
      } catch (error) {
        console.error('Error adding client:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Client ajouté avec succès');
      queryClient.invalidateQueries({ queryKey: ['garage', 'clients'] });
    },
    onError: (error) => {
      console.error('Error adding client:', error);
      toast.error('Erreur lors de l\'ajout du client');
    }
  });

  // Update client
  const updateClient = useMutation({
    mutationFn: async (updatedClient: GarageClient) => {
      try {
        const clientDoc = doc(db, COLLECTIONS.GARAGE.CLIENTS, updatedClient.id);
        await updateDoc(clientDoc, updatedClient);
        return updatedClient;
      } catch (error) {
        console.error('Error updating client:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Client mis à jour avec succès');
      queryClient.invalidateQueries({ queryKey: ['garage', 'clients'] });
    },
    onError: (error) => {
      console.error('Error updating client:', error);
      toast.error('Erreur lors de la mise à jour du client');
    }
  });

  // Delete client
  const deleteClient = useMutation({
    mutationFn: async (clientId: string) => {
      try {
        const clientDoc = doc(db, COLLECTIONS.GARAGE.CLIENTS, clientId);
        await deleteDoc(clientDoc);
        return clientId;
      } catch (error) {
        console.error('Error deleting client:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Client supprimé avec succès');
      queryClient.invalidateQueries({ queryKey: ['garage', 'clients'] });
    },
    onError: (error) => {
      console.error('Error deleting client:', error);
      toast.error('Erreur lors de la suppression du client');
    }
  });
  
  return {
    clients,
    isLoading,
    error,
    addClient,
    updateClient,
    deleteClient,
    refetchClients: refetch
  };
};
