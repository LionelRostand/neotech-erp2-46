
import { useState, useEffect, useCallback } from 'react';
import { useSafeFirestore } from '@/hooks/use-safe-firestore';
import { toast } from 'sonner';

export interface FirestoreDocument {
  id: string;
  [key: string]: any;
}

export function useFirestoreCollection<T extends FirestoreDocument>(collectionName: string) {
  const [documents, setDocuments] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const firestore = useSafeFirestore(collectionName);

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await firestore.getAll();
      console.log(`Fetched ${collectionName} data:`, result);
      setDocuments(result as T[]);
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      toast.error(`Erreur lors du chargement des données de ${collectionName}`);
    } finally {
      setIsLoading(false);
    }
  }, [firestore, collectionName]);

  const addDocument = async (document: Partial<T>) => {
    try {
      const result = await firestore.add(document);
      toast.success("Élément ajouté avec succès");
      await fetchDocuments();
      return result;
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      toast.error("Erreur lors de l'ajout");
      throw error;
    }
  };

  const updateDocument = async (id: string, data: Partial<T>) => {
    try {
      await firestore.update(id, data);
      toast.success("Élément mis à jour avec succès");
      await fetchDocuments();
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      toast.error("Erreur lors de la mise à jour");
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      await firestore.remove(id);
      toast.success("Élément supprimé avec succès");
      await fetchDocuments();
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      toast.error("Erreur lors de la suppression");
      throw error;
    }
  };

  useEffect(() => {
    console.log(`useFirestoreCollection hook for ${collectionName}: Initial data fetch`);
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    isLoading,
    addDocument,
    updateDocument,
    deleteDocument,
    refreshDocuments: fetchDocuments
  };
}
