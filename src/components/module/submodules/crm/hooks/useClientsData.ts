import { useState, useEffect, useCallback, useRef } from 'react';
import { Client, ClientFormData } from '../types/crm-types';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import mockClientsData from '../data/mockClients';

export const useClientsData = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const firestore = useFirestore(COLLECTIONS.CRM.CLIENTS);

  const cancelLoading = useCallback(() => {
    console.log("Cancelling client data loading operation");
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (isMounted.current) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchClients = useCallback(async () => {
    if (!isMounted.current) return;
    
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching clients data...');
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Chargement trop long, veuillez réessayer')), 10000);
      });
      
      const clientsPromise = firestore.getAll([where('_offlineDeleted', '!=', true)]);
      
      const fetchedClients = await Promise.race([clientsPromise, timeoutPromise]) as Client[];
      
      if (!isMounted.current) return;
      
      console.log('Fetched clients data:', fetchedClients);
      
      if (!fetchedClients || !Array.isArray(fetchedClients)) {
        console.log('No clients found or invalid data format');
        setClients([]);
      } else {
        const sortedClients = [...fetchedClients].sort((a, b) => 
          a.name.localeCompare(b.name)
        );
        setClients(sortedClients);
      }
      
      setIsOfflineMode(false);
      console.log('No clients found, but connection is working');
    } catch (err) {
      if (!isMounted.current) return;
      
      console.error('Error fetching clients:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      
      if (errorMessage.includes('abort') || errorMessage.includes('cancel')) {
        console.log('Client fetch operation was cancelled');
        return;
      }
      
      if (errorMessage.includes('trop long')) {
        setError(new Error('Le chargement des données a pris trop de temps. Veuillez réessayer.'));
      } else if (errorMessage.includes('timeout') || errorMessage.includes('unavailable')) {
        setError(new Error('Impossible de se connecter au serveur. Vérifiez votre connexion.'));
      } else {
        setError(err instanceof Error ? err : new Error('Erreur lors du chargement des données'));
      }
      
      setIsOfflineMode(true);
      
      if (clients.length === 0) {
        setClients([]);
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, [firestore, clients.length]);

  const addClient = useCallback(async (clientData: ClientFormData) => {
    try {
      console.log('Adding client:', clientData);
      const now = new Date().toISOString();
      
      const newClientData = {
        ...clientData,
        createdAt: now,
        updatedAt: now,
      };
      
      const result = await firestore.add(newClientData);
      console.log('Added client result:', result);
      
      const newClient: Client = {
        id: result.id,
        ...newClientData,
        status: clientData.status as 'active' | 'inactive' | 'lead',
      };
      
      setClients(prevClients => [...prevClients, newClient]);
      
      toast.success(`Client "${clientData.name}" ajouté avec succès`);
      return newClient;
    } catch (err) {
      console.error('Error adding client:', err);
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      
      if (message.includes('offline') || message.includes('unavailable') || message.includes('backend') || message.includes('timeout')) {
        setIsOfflineMode(true);
        toast.info('Client enregistré en mode hors ligne. Les données seront synchronisées lorsque la connexion sera rétablie.');
        
        const tempId = uuidv4();
        const now = new Date().toISOString();
        
        const offlineClient: Client = {
          id: tempId,
          ...clientData,
          status: clientData.status as 'active' | 'inactive' | 'lead',
          createdAt: now,
          updatedAt: now,
          _offlineCreated: true
        };
        
        setClients(prevClients => [...prevClients, offlineClient]);
        
        return offlineClient;
      } else {
        toast.error(`Erreur lors de l'ajout du client: ${message}`);
      }
      
      throw err;
    }
  }, [firestore]);

  const updateClient = useCallback(async (id: string, clientData: ClientFormData) => {
    try {
      console.log('Updating client:', id, clientData);
      const updatedData = {
        ...clientData,
        updatedAt: new Date().toISOString(),
      };
      
      const result = await firestore.update(id, updatedData);
      console.log('Update client result:', result);
      
      setClients(prevClients => 
        prevClients.map(client => 
          client.id === id 
            ? { 
                ...client, 
                ...updatedData, 
                status: clientData.status as 'active' | 'inactive' | 'lead',
              } 
            : client
        )
      );
      
      toast.success(`Client "${clientData.name}" mis à jour avec succès`);
      return result;
    } catch (err) {
      console.error('Error updating client:', err);
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      
      if (message.includes('offline') || message.includes('unavailable') || message.includes('backend') || message.includes('timeout')) {
        setIsOfflineMode(true);
        toast.info('Modification enregistrée en mode hors ligne. Les données seront synchronisées lorsque la connexion sera rétablie.');
        
        setClients(prevClients => 
          prevClients.map(client => 
            client.id === id 
              ? { 
                  ...client, 
                  ...clientData, 
                  updatedAt: new Date().toISOString(),
                  status: clientData.status as 'active' | 'inactive' | 'lead',
                  _offlineUpdated: true,
                } 
              : client
          )
        );
        
        return { id, _offlineUpdated: true };
      } else {
        toast.error(`Erreur lors de la mise à jour du client: ${message}`);
        throw err;
      }
    }
  }, [firestore]);

  const deleteClient = useCallback(async (id: string) => {
    try {
      console.log('Deleting client:', id);
      const result = await firestore.remove(id);
      console.log('Delete client result:', result);
      
      setClients(prevClients => prevClients.filter(client => client.id !== id));
      
      toast.success('Client supprimé avec succès');
      return result;
    } catch (err) {
      console.error('Error deleting client:', err);
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      
      if (message.includes('offline') || message.includes('unavailable') || message.includes('backend') || message.includes('timeout')) {
        setIsOfflineMode(true);
        toast.info('Suppression enregistrée en mode hors ligne. Les données seront synchronisées lorsque la connexion sera rétablie.');
        
        setClients(prevClients => prevClients.filter(client => client.id !== id));
        
        return { id, _offlineDeleted: true };
      } else {
        toast.error(`Erreur lors de la suppression du client: ${message}`);
        throw err;
      }
    }
  }, [firestore]);

  const seedMockClients = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const sectors = ['Technologie', 'Finance', 'Santé', 'Éducation', 'Commerce', 'Industrie', 'Services'];
      const statuses = ['active', 'inactive', 'lead'] as const;
      
      const mockClients: ClientFormData[] = Array.from({ length: 10 }, (_, i) => ({
        name: `Client Démo ${i + 1}`,
        contactName: `Contact ${i + 1}`,
        contactEmail: `contact${i + 1}@example.com`,
        contactPhone: `+33 1 23 45 67 ${i < 9 ? '0' + (i + 1) : i + 1}`,
        sector: sectors[Math.floor(Math.random() * sectors.length)],
        revenue: `${Math.floor(Math.random() * 500) + 50}K €`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        address: `${i + 1} Rue de Demo, 75000 Paris`,
        website: `https://example${i + 1}.com`,
        notes: `Notes pour le client démo ${i + 1}`
      }));
      
      const promises = mockClients.map(client => addClient(client));
      await Promise.all(promises);
      
      toast.success('10 clients de démonstration ajoutés avec succès');
      
      await fetchClients();
    } catch (err) {
      console.error('Error seeding mock clients:', err);
      toast.error(`Erreur lors de l'ajout des clients de démonstration: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  }, [addClient, fetchClients]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    isLoading,
    error,
    isOfflineMode,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
    seedMockClients,
    cancelLoading
  };
};

export default useClientsData;
