
import { useState } from 'react';
import { executeWithNetworkRetry, isOnline } from './firestore/network-handler';
import { toast } from 'sonner';

/**
 * Hook for interacting with Firestore collections with improved error handling
 * @param collectionPath Path to the collection
 */
export const useFirestore = (collectionPath: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all documents from the collection
   */
  const getAll = async (constraints?: any) => {
    setLoading(true);
    try {
      return await executeWithNetworkRetry(async () => {
        if (!isOnline()) {
          console.log('Operating in offline mode');
          toast.info('Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent être limitées.');
        }
        
        console.log(`Fetching all documents from ${collectionPath}`, constraints ? 'with constraints' : '');
        // Simulation - in a real app, this would call Firestore
        return [];
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(err);
      
      if (!isOnline()) {
        toast.error('Impossible d\'accéder aux données en mode hors ligne');
      } else {
        toast.error(`Erreur lors de la récupération des données: ${errorMessage}`);
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Get a document by ID
   */
  const getById = async (id: string) => {
    setLoading(true);
    try {
      return await executeWithNetworkRetry(async () => {
        console.log(`Fetching document ${id} from ${collectionPath}`);
        // Simulation
        return null;
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(err);
      
      if (!isOnline()) {
        toast.error('Impossible d\'accéder au document en mode hors ligne');
      } else {
        toast.error(`Erreur lors de la récupération du document: ${errorMessage}`);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Add a new document to the collection
   */
  const add = async (data: any) => {
    setLoading(true);
    try {
      return await executeWithNetworkRetry(async () => {
        console.log(`Adding document to ${collectionPath}`, data);
        // Simulation
        const id = 'simulated-id-' + Date.now();
        return { id, ...data };
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(err);
      
      if (!isOnline()) {
        toast.error('Impossible d\'ajouter le document en mode hors ligne');
      } else {
        toast.error(`Erreur lors de l'ajout du document: ${errorMessage}`);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Update an existing document
   */
  const update = async (id: string, data: any) => {
    setLoading(true);
    try {
      return await executeWithNetworkRetry(async () => {
        console.log(`Updating document ${id} in ${collectionPath}`, data);
        // Simulation
        return { id, ...data };
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(err);
      
      if (!isOnline()) {
        toast.error('Impossible de mettre à jour le document en mode hors ligne');
      } else {
        toast.error(`Erreur lors de la mise à jour du document: ${errorMessage}`);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Delete a document
   */
  const remove = async (id: string) => {
    setLoading(true);
    try {
      return await executeWithNetworkRetry(async () => {
        console.log(`Removing document ${id} from ${collectionPath}`);
        // Simulation
        return true;
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(err);
      
      if (!isOnline()) {
        toast.error('Impossible de supprimer le document en mode hors ligne');
      } else {
        toast.error(`Erreur lors de la suppression du document: ${errorMessage}`);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Create or replace a document with a specific ID
   */
  const set = async (id: string, data: any) => {
    setLoading(true);
    try {
      return await executeWithNetworkRetry(async () => {
        console.log(`Setting document ${id} in ${collectionPath}`, data);
        // Simulation
        return { id, ...data };
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      setError(err);
      
      if (!isOnline()) {
        toast.error('Impossible d\'écrire le document en mode hors ligne');
      } else {
        toast.error(`Erreur lors de l'écriture du document: ${errorMessage}`);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    collectionPath,
    loading,
    error,
    getAll,
    getById,
    add,
    update,
    remove,
    set
  };
};
