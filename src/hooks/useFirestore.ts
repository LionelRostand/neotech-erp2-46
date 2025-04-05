
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
  
  const getAll = async (constraints?: any) => {
    setLoading(true);
    try {
      const path = collectionPath || '';
      const results = await getAllDocuments(path, constraints);
      return results;
    } catch (err: any) {
      console.error('Error fetching documents:', err);
      setError(err);
      toast.error(`Erreur: ${err.message}`);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const getById = async (id: string) => {
    setLoading(true);
    try {
      const path = collectionPath || '';
      return await getDocumentById(path, id);
    } catch (err: any) {
      console.error('Error fetching document:', err);
      setError(err);
      toast.error(`Erreur: ${err.message}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const add = async (data: any) => {
    setLoading(true);
    try {
      const path = collectionPath || '';
      return await addDocument(path, data);
    } catch (err: any) {
      console.error('Error adding document:', err);
      setError(err);
      toast.error(`Erreur: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const update = async (id: string, data: any) => {
    setLoading(true);
    try {
      const path = collectionPath || '';
      return await updateDocument(path, id, data);
    } catch (err: any) {
      console.error('Error updating document:', err);
      setError(err);
      toast.error(`Erreur: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const remove = async (id: string) => {
    setLoading(true);
    try {
      const path = collectionPath || '';
      return await deleteDocument(path, id);
    } catch (err: any) {
      console.error('Error deleting document:', err);
      setError(err);
      toast.error(`Erreur: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const set = async (id: string, data: any) => {
    setLoading(true);
    try {
      const path = collectionPath || '';
      return await setDocument(path, id, data);
    } catch (err: any) {
      console.error('Error setting document:', err);
      setError(err);
      toast.error(`Erreur: ${err.message}`);
      throw err;
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
