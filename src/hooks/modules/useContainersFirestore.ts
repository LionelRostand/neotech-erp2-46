
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc,
  doc, 
  updateDoc,
  deleteDoc
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { Container } from "@/types/freight";
import { toast } from "sonner";

// Utility to validate collection path
const validateCollectionPath = (path: string): boolean => {
  if (!path || path.trim() === '') {
    console.error('Collection path is empty or invalid');
    toast.error('Erreur: Chemin de collection invalide');
    return false;
  }
  return true;
};

// Hook for creating a new container
export const useCreateContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (containerData: Omit<Container, "id">) => {
      // Validate the collection path
      const collectionPath = COLLECTIONS.FREIGHT.CONTAINERS;
      if (!validateCollectionPath(collectionPath)) {
        throw new Error('Invalid collection path');
      }
      
      // Add timestamp for createdAt if not provided
      if (!containerData.createdAt) {
        containerData.createdAt = new Date().toISOString();
      }

      const docRef = await addDoc(
        collection(db, collectionPath), 
        containerData
      );
      
      return { id: docRef.id, ...containerData };
    },
    onSuccess: () => {
      // Invalidate the containers query to refresh data
      queryClient.invalidateQueries({ queryKey: ['freight', 'containers'] });
    },
    onError: (error) => {
      console.error('Error creating container:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });
};

// Hook for updating an existing container
export const useUpdateContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data
    }: {
      id: string;
      data: Partial<Container>;
    }) => {
      // Validate the collection path
      const collectionPath = COLLECTIONS.FREIGHT.CONTAINERS;
      if (!validateCollectionPath(collectionPath)) {
        throw new Error('Invalid collection path');
      }
      
      // Add updatedAt timestamp
      data.updatedAt = new Date().toISOString();
      
      const docRef = doc(db, collectionPath, id);
      await updateDoc(docRef, data);
      
      return { id, ...data };
    },
    onSuccess: () => {
      // Invalidate the containers query to refresh data
      queryClient.invalidateQueries({ queryKey: ['freight', 'containers'] });
    },
    onError: (error) => {
      console.error('Error updating container:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });
};

// Hook for deleting a container
export const useDeleteContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Validate the collection path
      const collectionPath = COLLECTIONS.FREIGHT.CONTAINERS;
      if (!validateCollectionPath(collectionPath)) {
        throw new Error('Invalid collection path');
      }
      
      const docRef = doc(db, collectionPath, id);
      await deleteDoc(docRef);
      return id;
    },
    onSuccess: () => {
      // Invalidate the containers query to refresh data
      queryClient.invalidateQueries({ queryKey: ['freight', 'containers'] });
    },
    onError: (error) => {
      console.error('Error deleting container:', error);
      toast.error(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  });
};
