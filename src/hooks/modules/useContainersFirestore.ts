
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc,
  doc, 
  updateDoc,
  deleteDoc,
  Timestamp
} from "firebase/firestore";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { Container } from "@/types/freight";

// Hook for creating a new container
export const useCreateContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (containerData: Omit<Container, "id">) => {
      // Add timestamp for createdAt if not provided
      if (!containerData.createdAt) {
        containerData.createdAt = new Date().toISOString();
      }

      const docRef = await addDoc(
        collection(db, COLLECTIONS.FREIGHT.CONTAINERS), 
        containerData
      );
      
      return { id: docRef.id, ...containerData };
    },
    onSuccess: () => {
      // Invalidate the containers query to refresh data
      queryClient.invalidateQueries({ queryKey: ['freight', 'containers'] });
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
      // Add updatedAt timestamp
      data.updatedAt = new Date().toISOString();
      
      const docRef = doc(db, COLLECTIONS.FREIGHT.CONTAINERS, id);
      await updateDoc(docRef, data);
      
      return { id, ...data };
    },
    onSuccess: () => {
      // Invalidate the containers query to refresh data
      queryClient.invalidateQueries({ queryKey: ['freight', 'containers'] });
    }
  });
};

// Hook for deleting a container
export const useDeleteContainer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const docRef = doc(db, COLLECTIONS.FREIGHT.CONTAINERS, id);
      await deleteDoc(docRef);
      return id;
    },
    onSuccess: () => {
      // Invalidate the containers query to refresh data
      queryClient.invalidateQueries({ queryKey: ['freight', 'containers'] });
    }
  });
};
