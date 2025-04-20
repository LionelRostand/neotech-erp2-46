
import { useState } from 'react';
import { addDocument, updateDocument, deleteDocument, setDocument, getAllDocuments, getDocumentById } from './firestore/firestore-utils';
import { toast } from 'sonner';

/**
 * Hook that provides access to Firestore operations with loading and error states
 * @param collectionPath Optional collection path to scope the operations
 */
export const useFirestore = (collectionPath?: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Helper to handle Firestore errors consistently
  const handleFirestoreError = (err: any, operation: string) => {
    console.error(`Error during ${operation}:`, err);
    setError(err);
    
    // Handle 400 errors specifically 
    if (err.code === 400 || (err.message && err.message.includes('400'))) {
      toast.error(`Erreur de connexion à la base de données. L'application fonctionne en mode démo.`);
    } else {
      toast.error(`Erreur: ${err.message}`);
    }
    
    throw err;
  };
  
  // Helper to ensure we have a valid collection path
  const ensureValidPath = (path?: string): string => {
    if (!path || path.trim() === '') {
      console.warn('Collection path is empty, using fallback');
      return 'default-collection';
    }
    return path;
  };
  
  const getAll = async (constraints?: any) => {
    setLoading(true);
    try {
      const path = ensureValidPath(collectionPath);
      // Fix: only pass one argument
      const results = await getAllDocuments(path);
      return results;
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err);
      
      // Show different message based on error type
      if (err.code === 400 || (err.message && err.message.includes('400'))) {
        toast.error(`Erreur de connexion à la base de données. L'application fonctionne en mode démo.`);
      } else {
        toast.error(`Erreur: ${err.message}`);
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const getById = async (id: string) => {
    setLoading(true);
    try {
      const path = ensureValidPath(collectionPath);
      return await getDocumentById(path, id);
    } catch (err: any) {
      return handleFirestoreError(err, 'fetching document');
    } finally {
      setLoading(false);
    }
  };
  
  const add = async (data: any) => {
    setLoading(true);
    try {
      const path = ensureValidPath(collectionPath);
      return await addDocument(path, data);
    } catch (err: any) {
      return handleFirestoreError(err, 'adding document');
    } finally {
      setLoading(false);
    }
  };
  
  const update = async (id: string, data: any) => {
    setLoading(true);
    try {
      const path = ensureValidPath(collectionPath);
      return await updateDocument(path, id, data);
    } catch (err: any) {
      return handleFirestoreError(err, 'updating document');
    } finally {
      setLoading(false);
    }
  };
  
  const remove = async (id: string) => {
    setLoading(true);
    try {
      const path = ensureValidPath(collectionPath);
      return await deleteDocument(path, id);
    } catch (err: any) {
      return handleFirestoreError(err, 'deleting document');
    } finally {
      setLoading(false);
    }
  };
  
  const set = async (id: string, data: any) => {
    setLoading(true);
    try {
      const path = ensureValidPath(collectionPath);
      return await setDocument(path, id, data);
    } catch (err: any) {
      return handleFirestoreError(err, 'setting document');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    loading,
    error,
    getAll,
    getById,
    add,
    update,
    remove,
    set,
    collectionPath
  };
};

// Export default for backward compatibility
export default useFirestore;
