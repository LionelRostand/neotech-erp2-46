
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

// Get the validated collection path
const getContainersCollectionPath = (): string => {
  const collectionPath = COLLECTIONS.FREIGHT.CONTAINERS;
  console.log(`Using containers collection path: ${collectionPath}`);
  if (!collectionPath || collectionPath.trim() === '') {
    console.error('Containers collection path is empty or invalid');
    toast.error('Erreur: Chemin de collection des conteneurs invalide');
    return 'freight_containers'; // Fallback to a hardcoded path
  }
  return collectionPath;
};

// Hook for creating a new container
export const useCreateContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (containerData: Omit<Container, "id">) => {
      // Get and validate the collection path
      const collectionPath = getContainersCollectionPath();
      if (!validateCollectionPath(collectionPath)) {
        throw new Error('Invalid collection path');
      }
      
      // Add timestamp for createdAt if not provided
      if (!containerData.createdAt) {
        containerData.createdAt = new Date().toISOString();
      }

      console.log(`Adding container to collection: ${collectionPath}`, containerData);
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
      // Get and validate the collection path
      const collectionPath = getContainersCollectionPath();
      if (!validateCollectionPath(collectionPath)) {
        throw new Error('Invalid collection path');
      }
      
      // Add updatedAt timestamp
      data.updatedAt = new Date().toISOString();
      
      console.log(`Updating container ${id} in collection: ${collectionPath}`, data);
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
      // Get and validate the collection path
      const collectionPath = getContainersCollectionPath();
      if (!validateCollectionPath(collectionPath)) {
        throw new Error('Invalid collection path');
      }
      
      console.log(`Deleting container ${id} from collection: ${collectionPath}`);
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
