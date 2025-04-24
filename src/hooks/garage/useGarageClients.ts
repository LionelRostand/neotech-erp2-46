
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { useState, useCallback, useEffect } from 'react';
import { isOnline, initNetworkListeners } from '@/hooks/firestore/network-handler';

export const useGarageClients = () => {
  const { add, getAll } = useFirestore(COLLECTIONS.GARAGE.CLIENTS);
  const [clientCache, setClientCache] = useState<GarageClient[]>([]);
  const [networkStatus, setNetworkStatus] = useState({
    isOnline: isOnline(),
    reconnecting: false
  });

  // Setup network status listeners
  useEffect(() => {
    const { cleanup } = initNetworkListeners(
      // Online handler
      () => {
        setNetworkStatus({ isOnline: true, reconnecting: true });
        // Trigger a refetch when we come back online
        refetch().finally(() => {
          setNetworkStatus(prev => ({ ...prev, reconnecting: false }));
        });
      },
      // Offline handler
      () => {
        setNetworkStatus({ isOnline: false, reconnecting: false });
        toast.warning('Vous êtes hors ligne. Certaines fonctionnalités seront limitées.');
      }
    );
    
    return cleanup;
  }, []);

  // Use React Query for data fetching with caching
  const { 
    data: clients = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['garage', 'clients'],
    queryFn: async () => {
      try {
        console.log('Récupération des clients depuis:', COLLECTIONS.GARAGE.CLIENTS);
        
        if (!networkStatus.isOnline) {
          console.log('En mode hors ligne, utilisation du cache');
          return clientCache;
        }
        
        const result = await getAll() as GarageClient[];
        console.log('Clients récupérés:', result);
        
        // Update our local cache
        setClientCache(result);
        return result;
      } catch (err) {
        console.error('Erreur lors de la récupération des clients:', err);
        // Return cache if we have it, otherwise empty array
        return clientCache.length > 0 ? clientCache : [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: networkStatus.isOnline ? 2 : 0 // Only retry if online
  });

  // Add client with optimistic update
  const addClient = useCallback(async (clientData: Omit<GarageClient, 'id'>) => {
    try {
      // Check if we're online
      if (!networkStatus.isOnline) {
        toast.error('Impossible d\'ajouter un client en mode hors ligne');
        throw new Error('Offline mode - cannot add client');
      }
      
      console.log('Tentative d\'ajout du client:', clientData);
      
      // Prepare new client data
      const newClient: Omit<GarageClient, 'id'> = {
        ...clientData,
        vehicles: [],
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      // Create optimistic client with temporary ID
      const optimisticId = `temp-${Date.now()}`;
      const optimisticClient = { id: optimisticId, ...newClient } as GarageClient;
      
      // Update local cache immediately for optimistic UI
      setClientCache(prev => [...prev, optimisticClient]);
      
      // Make the actual API call
      const addedClient = await add(newClient);
      console.log('Client ajouté avec succès:', addedClient);
      
      toast.success('Client ajouté avec succès');
      
      // Update cache with the correct ID from server
      setClientCache(prev => prev.map(client => 
        client.id === optimisticId ? { ...client, id: addedClient.id } : client
      ));
      
      await refetch();
      return addedClient;
    } catch (err) {
      console.error('Erreur lors de l\'ajout du client:', err);
      
      // Remove the optimistic client from the cache
      setClientCache(prev => prev.filter(client => !client.id.startsWith('temp-')));
      
      toast.error('Erreur lors de l\'ajout du client');
      throw err;
    }
  }, [add, refetch, networkStatus.isOnline]);

  return {
    clients,
    addClient,
    isLoading,
    error,
    refetchClients: refetch,
    isOffline: !networkStatus.isOnline,
    isReconnecting: networkStatus.reconnecting
  };
};
