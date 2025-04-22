
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
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
}

export const useFreightInvoices = () => {
  const [invoices, setInvoices] = useState<FreightInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchInvoices = async () => {
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
    };

    fetchInvoices();
  }, []);

  return { invoices, isLoading, error };
};

export default useFreightInvoices;
