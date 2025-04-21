
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, orderBy, query, serverTimestamp, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

const COLLECTION_PATH = 'freight_containers';

export const useContainers = () => {
  return useQuery({
    queryKey: ['freight', 'containers'],
    queryFn: async () => {
      try {
        const q = query(collection(db, COLLECTION_PATH), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error("Error fetching containers:", error);
        toast.error("Erreur lors du chargement des conteneurs");
        return [];
      }
    }
  });
};

export const useAddContainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      try {
        const docRef = await addDoc(collection(db, COLLECTION_PATH), {
          ...data,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        return { id: docRef.id, ...data };
      } catch (error) {
        console.error("Error adding container:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freight', 'containers'] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Erreur lors de l'ajout du conteneur");
    }
  });
};

export const useUpdateContainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      try {
        const docRef = doc(db, COLLECTION_PATH, id);
        await updateDoc(docRef, {
          ...data,
          updatedAt: serverTimestamp()
        });
        return { id, ...data };
      } catch (error) {
        console.error("Error updating container:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freight', 'containers'] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Erreur lors de la mise à jour du conteneur");
    }
  });
};

export const useDeleteContainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const docRef = doc(db, COLLECTION_PATH, id);
        await deleteDoc(docRef);
        return id;
      } catch (error) {
        console.error("Error deleting container:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freight', 'containers'] });
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Erreur lors de la suppression du conteneur");
    }
  });
};
