
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Payment } from '../types/accounting-types';
import { orderBy, where } from 'firebase/firestore';
import { toast } from 'sonner';

export const usePayments = (filters?: { status?: string; invoiceId?: string; }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const paymentsCollection = useFirestore(COLLECTIONS.ACCOUNTING.PAYMENTS);

  const loadPayments = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Construire les contraintes de requête
      const constraints = [];
      
      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }
      
      if (filters?.invoiceId) {
        constraints.push(where('invoiceId', '==', filters.invoiceId));
      }
      
      // Toujours trier par date
      constraints.push(orderBy('date', 'desc'));
      
      const data = await paymentsCollection.getAll(constraints);
      
      // Transformer en objets Payment
      const paymentsData = data.map((doc: any) => ({
        id: doc.id,
        invoiceId: doc.invoiceId || '',
        invoiceNumber: doc.invoiceNumber || '',
        clientName: doc.clientName || '',
        clientId: doc.clientId || '',
        amount: doc.amount || 0,
        currency: doc.currency || 'EUR',
        paymentMethod: doc.paymentMethod || doc.method || 'bank_transfer',
        paymentDate: doc.paymentDate || doc.date || '',
        status: doc.status || 'pending',
        // Map properties that might be referenced directly
        date: doc.date || '',
        method: doc.method || 'bank_transfer',
        transactionId: doc.transactionId || '',
        reference: doc.reference || '',
        notes: doc.notes || '',
        createdAt: doc.createdAt ? new Date(doc.createdAt.seconds * 1000).toISOString() : '',
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000).toISOString() : '',
        createdBy: doc.createdBy || '',
      }));
      
      setPayments(paymentsData);
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error);
      toast.error('Impossible de charger les paiements');
    } finally {
      setIsLoading(false);
    }
  }, [filters, paymentsCollection]);
  
  useEffect(() => {
    loadPayments();
  }, [loadPayments]);
  
  return { payments, isLoading, reload: loadPayments };
};
