
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { addDoc, updateDoc, deleteDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { GarageClient } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageClients = () => {
  const queryClient = useQueryClient();
  
  // Vérifier que le chemin de collection est défini et non vide
  const garageClientsPath = COLLECTIONS.GARAGE.CLIENTS || '';
  
  // S'assurer que le chemin existe avant de faire la requête
  const validCollectionPath = garageClientsPath && garageClientsPath.trim() !== '' 
    ? garageClientsPath 
    : 'garage_clients'; // Fallback à une valeur par défaut si nécessaire
  
  // Fetch clients data avec un chemin garanti
  const { data: clients = [], isLoading, error, refetch } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: () => fetchCollectionData<GarageClient>(validCollectionPath),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Add a new client
  const addClient = useMutation({
    mutationFn: async (newClient: Omit<GarageClient, 'id'>) => {
      try {
        // S'assurer que createdAt est une chaîne de date ISO valide
        const clientWithDate = {
          ...newClient,
          createdAt: new Date().toISOString(),
          status: newClient.status || 'active', // Valeur par défaut si non définie
        };
        
        const collectionRef = collection(db, validCollectionPath);
        const docRef = await addDoc(collectionRef, clientWithDate);
        return { id: docRef.id, ...clientWithDate };
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
        // S'assurer que si createdAt n'est pas valide, on la met à jour
        if (!updatedClient.createdAt || isNaN(new Date(updatedClient.createdAt).getTime())) {
          updatedClient.createdAt = new Date().toISOString();
        }
        
        const clientDoc = doc(db, validCollectionPath, updatedClient.id);
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
        const clientDoc = doc(db, validCollectionPath, clientId);
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
