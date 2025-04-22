
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, query, orderBy, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export interface FreightInvoice {
  id: string;
  clientName: string;
  amount: number;
  shipmentReference?: string;
  containerNumber?: string;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  paidAt?: string;
  paymentMethod?: string;
  paymentReference?: string;
  invoiceNumber?: string;
  currency?: string;
}

export const useFreightInvoices = () => {
  const [invoices, setInvoices] = useState<FreightInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    try {
      const collectionPath = COLLECTIONS.FREIGHT.BILLING;
      console.log(`Fetching freight invoices from collection: ${collectionPath}`);
      
      const invoicesRef = collection(db, collectionPath);
      const q = query(invoicesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const invoicesData: FreightInvoice[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as FreightInvoice));
      
      console.log(`Retrieved ${invoicesData.length} freight invoices`);
      setInvoices(invoicesData);
    } catch (err) {
      console.error("Error fetching freight invoices:", err);
      setError(err instanceof Error ? err : new Error('Error fetching invoices'));
      toast.error("Erreur lors du chargement des factures");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const updateInvoice = useCallback(async (id: string, data: Partial<FreightInvoice>) => {
    try {
      const invoiceRef = doc(db, COLLECTIONS.FREIGHT.BILLING, id);
      await updateDoc(invoiceRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      
      // Refresh the invoice list
      await fetchInvoices();
      return true;
    } catch (err) {
      console.error("Error updating freight invoice:", err);
      toast.error("Erreur lors de la mise à jour de la facture");
      return false;
    }
  }, [fetchInvoices]);

  return { 
    invoices, 
    isLoading, 
    error, 
    refetchInvoices: fetchInvoices,
    updateInvoice
  };
};

export default useFreightInvoices;
