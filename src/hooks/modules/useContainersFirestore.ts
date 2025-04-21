
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, getDocs, addDoc, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const COLLECTION_PATH = 'freight_containers';

export const useContainers = () => {
  return useQuery({
    queryKey: ['freight', 'containers'],
    queryFn: async () => {
      const q = query(collection(db, COLLECTION_PATH), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
  });
};

export const useAddContainer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const docRef = await addDoc(collection(db, COLLECTION_PATH), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['freight', 'containers'] });
    }
  });
};
