
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { addDoc, updateDoc, deleteDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Invoice } from '@/components/module/submodules/garage/types/garage-types';

export const useGarageInvoices = () => {
  const queryClient = useQueryClient();
  
  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['garage', 'invoices'],
    queryFn: () => fetchCollectionData<Invoice>(COLLECTIONS.GARAGE.INVOICES),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const updateInvoice = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Invoice> }) => {
      const invoiceRef = doc(db, COLLECTIONS.GARAGE.INVOICES, id);
      await updateDoc(invoiceRef, data);
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'invoices'] });
    },
  });

  const deleteInvoice = useMutation({
    mutationFn: async (id: string) => {
      const invoiceRef = doc(db, COLLECTIONS.GARAGE.INVOICES, id);
      await deleteDoc(invoiceRef);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'invoices'] });
    },
  });

  return {
    invoices,
    isLoading,
    error,
    updateInvoice: async (id: string, data: Partial<Invoice>) => {
      await updateInvoice.mutateAsync({ id, data });
    },
    deleteInvoice: async (id: string) => {
      await deleteInvoice.mutateAsync(id);
    }
  };
};
