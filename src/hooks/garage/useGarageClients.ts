
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GarageClient } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageClients = () => {
  const queryClient = useQueryClient();
  const collectionPath = COLLECTIONS.GARAGE.CLIENTS;
  
  // Query to fetch clients
  const { 
    data: clients = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: async () => {
      try {
        return await fetchCollectionData(COLLECTIONS.GARAGE.CLIENTS);
      } catch (err) {
        console.error('Error fetching clients:', err);
        toast.error('Erreur lors du chargement des clients');
        return [];
      }
    }
  });

  // Mutation to add a client
  const addClient = useMutation({
    mutationFn: async (clientData: Omit<GarageClient, 'id'>) => {
      const collectionRef = collection(db, collectionPath);
      const docRef = await addDoc(collectionRef, clientData);
      return { id: docRef.id, ...clientData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'clients'] });
      toast.success('Client ajouté avec succès');
    },
    onError: (error) => {
      console.error('Error adding client:', error);
      toast.error('Erreur lors de l\'ajout du client');
    }
  });

  // Mutation to update a client
  const updateClient = useMutation({
    mutationFn: async (updatedClient: GarageClient) => {
      const { id, ...clientData } = updatedClient;
      const docRef = doc(db, collectionPath, id);
      await updateDoc(docRef, clientData);
      return updatedClient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'clients'] });
      toast.success('Client mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating client:', error);
      toast.error('Erreur lors de la mise à jour du client');
    }
  });

  // Mutation to delete a client
  const deleteClient = useMutation({
    mutationFn: async (clientId: string) => {
      const docRef = doc(db, collectionPath, clientId);
      await deleteDoc(docRef);
      return clientId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'clients'] });
      toast.success('Client supprimé avec succès');
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
    refetch,
    addClient,
    updateClient,
    deleteClient
  };
};
