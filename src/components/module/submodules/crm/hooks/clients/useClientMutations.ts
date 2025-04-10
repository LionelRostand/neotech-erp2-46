
import { useState } from 'react';
import { collection, doc, deleteDoc, addDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { ClientFormData, Client } from '../../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from '@/hooks/firestore/network-handler';

export const useClientMutations = (refreshClients: () => Promise<void>) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const addClient = async (clientData: ClientFormData): Promise<Client | void> => {
    try {
      setIsLoading(true);
      
      // Vérifier que l'utilisateur est authentifié
      if (!auth.currentUser) {
        toast.error("Vous devez être connecté pour ajouter un client");
        return;
      }
      
      const statusValue = clientData.status as 'active' | 'inactive' | 'lead';
      
      const newClientData = {
        ...clientData,
        status: statusValue,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: auth.currentUser.uid,
      };
      
      let docRef;
      await executeWithNetworkRetry(async () => {
        // Use the correct collection path from COLLECTIONS
        const clientsCollection = collection(db, COLLECTIONS.CRM.CLIENTS);
        docRef = await addDoc(clientsCollection, newClientData);
        console.log(`Client added to collection ${COLLECTIONS.CRM.CLIENTS} with ID: ${docRef.id}`);
        toast.success("Client ajouté avec succès");
      });
      
      await refreshClients();
      
      if (docRef) {
        return { 
          id: docRef.id, 
          ...newClientData 
        } as Client;
      }
    } catch (error: any) {
      console.error("Error adding client:", error);
      
      if (error.message.includes('offline') || error.message.includes('unavailable')) {
        toast.error("Impossible d'ajouter le client en mode hors ligne");
      } else if (error.code === 'permission-denied') {
        toast.error("Vous n'avez pas les droits nécessaires pour ajouter un client");
      } else {
        toast.error(`Erreur lors de l'ajout du client: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (clientId: string, clientData: ClientFormData): Promise<Client | void> => {
    try {
      setIsLoading(true);
      
      // Vérifier que l'utilisateur est authentifié
      if (!auth.currentUser) {
        toast.error("Vous devez être connecté pour mettre à jour un client");
        return;
      }
      
      const statusValue = clientData.status as 'active' | 'inactive' | 'lead';
      
      const updateData = {
        ...clientData,
        status: statusValue,
        updatedAt: new Date().toISOString(),
        updatedBy: auth.currentUser.uid,
      };
      
      await executeWithNetworkRetry(async () => {
        // Use the correct collection path from COLLECTIONS
        const clientDocRef = doc(db, COLLECTIONS.CRM.CLIENTS, clientId);
        await updateDoc(clientDocRef, updateData);
        console.log(`Client ${clientId} updated successfully`);
        toast.success("Client mis à jour avec succès");
      });
      
      await refreshClients();
      
      // Retourner le client mis à jour en incluant la propriété createdAt nécessaire au type Client
      return { 
        id: clientId, 
        ...updateData,
        createdAt: await fetchClientCreatedAt(clientId) || new Date().toISOString() 
      } as Client;
    } catch (error: any) {
      console.error("Error updating client:", error);
      
      if (error.message.includes('offline') || error.message.includes('unavailable')) {
        toast.error("Impossible de mettre à jour le client en mode hors ligne");
      } else if (error.code === 'permission-denied') {
        toast.error("Vous n'avez pas les droits nécessaires pour modifier ce client");
      } else {
        toast.error(`Erreur lors de la mise à jour du client: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction utilitaire pour récupérer la date de création d'un client existant
  const fetchClientCreatedAt = async (clientId: string): Promise<string | null> => {
    try {
      const clientDocRef = doc(db, COLLECTIONS.CRM.CLIENTS, clientId);
      const clientDoc = await executeWithNetworkRetry(async () => {
        const docSnap = await clientDocRef.get();
        if (docSnap.exists()) {
          return docSnap.data();
        }
        return null;
      });
      
      return clientDoc?.createdAt || null;
    } catch (error) {
      console.error("Error fetching client created date:", error);
      return null;
    }
  };

  const deleteClient = async (clientId: string): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Vérifier que l'utilisateur est authentifié
      if (!auth.currentUser) {
        toast.error("Vous devez être connecté pour supprimer un client");
        return;
      }
      
      await executeWithNetworkRetry(async () => {
        // Use the correct collection path from COLLECTIONS
        const clientDocRef = doc(db, COLLECTIONS.CRM.CLIENTS, clientId);
        await deleteDoc(clientDocRef);
        console.log(`Client ${clientId} deleted successfully`);
        toast.success("Client supprimé avec succès");
      });
      
      // Forcer une actualisation des clients après la suppression
      await refreshClients();
      
    } catch (error: any) {
      console.error("Error deleting client:", error);
      
      if (error.message.includes('offline') || error.message.includes('unavailable')) {
        toast.error("Impossible de supprimer le client en mode hors ligne");
      } else if (error.code === 'permission-denied') {
        toast.error("Vous n'avez pas les droits nécessaires pour supprimer ce client");
      } else {
        toast.error(`Erreur lors de la suppression du client: ${error.message}`);
      }
      
      // Refresh the client list in case of error to ensure UI is in sync
      await refreshClients();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    addClient,
    updateClient,
    deleteClient
  };
};
