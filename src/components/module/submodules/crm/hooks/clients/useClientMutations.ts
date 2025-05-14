
import { useState } from 'react';
import { toast } from 'sonner';
import { addDoc, doc, updateDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Client } from '@/types/crm';

// Hook to handle client mutations
export const useClientMutations = (refreshCallback: () => void) => {
  const [isLoading, setIsLoading] = useState(false);

  const addClient = async (clientData: Partial<Client>) => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, COLLECTIONS.CRM.CLIENTS || 'crm_clients'), {
        ...clientData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      toast.success('Client ajouté avec succès');
      refreshCallback();
      return true;
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Erreur lors de l\'ajout du client');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateClient = async (id: string, clientData: Partial<Client>) => {
    if (!id) return false;
    
    setIsLoading(true);
    try {
      const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS || 'crm_clients', id);
      await updateDoc(clientRef, {
        ...clientData,
        updatedAt: new Date()
      });
      toast.success('Client mis à jour avec succès');
      refreshCallback();
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Erreur lors de la mise à jour du client');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    if (!id) return false;
    
    setIsLoading(true);
    try {
      const clientRef = doc(db, COLLECTIONS.CRM.CLIENTS || 'crm_clients', id);
      await deleteDoc(clientRef);
      toast.success('Client supprimé avec succès');
      refreshCallback();
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Erreur lors de la suppression du client');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, addClient, updateClient, deleteClient };
};
