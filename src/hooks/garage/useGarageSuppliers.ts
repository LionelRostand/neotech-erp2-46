
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface GarageSupplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  category?: string;
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export const useGarageSuppliers = () => {
  const queryClient = useQueryClient();
  const collectionPath = COLLECTIONS.GARAGE.SUPPLIERS;

  const { data: suppliers = [], isLoading, error, refetch } = useQuery({
    queryKey: ['garage', 'suppliers'],
    queryFn: () => fetchCollectionData<GarageSupplier>(collectionPath)
  });

  const addSupplier = useMutation({
    mutationFn: async (supplierData: Omit<GarageSupplier, 'id'>) => {
      const collectionRef = collection(db, collectionPath);
      const docRef = await addDoc(collectionRef, supplierData);
      return { id: docRef.id, ...supplierData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'suppliers'] });
      toast.success('Fournisseur ajouté avec succès');
    },
    onError: (error) => {
      console.error('Error adding supplier:', error);
      toast.error("Erreur lors de l'ajout du fournisseur");
    }
  });

  const updateSupplier = useMutation({
    mutationFn: async (updatedSupplier: GarageSupplier) => {
      const { id, ...supplierData } = updatedSupplier;
      const docRef = doc(db, collectionPath, id);
      await updateDoc(docRef, supplierData);
      return updatedSupplier;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'suppliers'] });
      toast.success('Fournisseur mis à jour avec succès');
    },
    onError: (error) => {
      console.error('Error updating supplier:', error);
      toast.error('Erreur lors de la mise à jour du fournisseur');
    }
  });

  const deleteSupplier = useMutation({
    mutationFn: async (supplierId: string) => {
      const docRef = doc(db, collectionPath, supplierId);
      await deleteDoc(docRef);
      return supplierId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['garage', 'suppliers'] });
      toast.success('Fournisseur supprimé avec succès');
    },
    onError: (error) => {
      console.error('Error deleting supplier:', error);
      toast.error('Erreur lors de la suppression du fournisseur');
    }
  });

  return {
    suppliers,
    isLoading,
    error,
    refetch,
    addSupplier,
    updateSupplier,
    deleteSupplier
  };
};
