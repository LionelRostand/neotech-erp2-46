
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { addDoc, updateDoc, doc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Invoice } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

export const useGarageInvoices = () => {
  const queryClient = useQueryClient();
  
  // Get invoices
  const { data: invoices = [], isLoading, error } = useQuery({
    queryKey: ['garage', 'invoices'],
    queryFn: () => fetchCollectionData(COLLECTIONS.GARAGE.INVOICES),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Create invoice
  const createInvoice = useMutation({
    mutationFn: async (invoiceData: any) => {
      const invoicesRef = collection(db, COLLECTIONS.GARAGE.INVOICES);
      const docRef = await addDoc(invoicesRef, {
        ...invoiceData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return { id: docRef.id, ...invoiceData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'invoices'] });
      toast.success('Facture créée avec succès');
    },
    onError: (error) => {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  });

  // Update invoice
  const updateInvoice = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Invoice> }) => {
      const invoiceRef = doc(db, COLLECTIONS.GARAGE.INVOICES, id);
      await updateDoc(invoiceRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      return { id, ...data };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'invoices'] });
      toast.success('Facture mise à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating invoice:', error);
      toast.error('Erreur lors de la mise à jour de la facture');
    }
  });

  return {
    invoices,
    isLoading,
    error,
    createInvoice: async (data: any) => {
      await createInvoice.mutateAsync(data);
    },
    updateInvoice: async (id: string, data: Partial<Invoice>) => {
      await updateInvoice.mutateAsync({ id, data });
    }
  };
};
