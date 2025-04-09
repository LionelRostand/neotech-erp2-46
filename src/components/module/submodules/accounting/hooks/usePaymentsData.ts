
import { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Payment } from '../types/accounting-types';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';

export const usePaymentsData = (filterStatus?: string) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Préparer les contraintes de requête
  const constraints: QueryConstraint[] = [orderBy('date', 'desc')];
  
  if (filterStatus && filterStatus !== 'all') {
    constraints.push(where('status', '==', filterStatus));
  }

  // Utiliser le hook useCollectionData pour récupérer les données en temps réel
  const { data, isLoading: dataLoading, error } = useCollectionData(
    COLLECTIONS.ACCOUNTING.PAYMENTS,
    constraints
  );

  useEffect(() => {
    if (!dataLoading && data) {
      // Transformer les données en objets Payment
      const formattedPayments: Payment[] = data.map((doc: any) => ({
        id: doc.id,
        invoiceId: doc.invoiceId || '',
        amount: doc.amount || 0,
        currency: doc.currency || 'EUR',
        date: doc.date || '',
        method: doc.method || 'bank_transfer',
        status: doc.status || 'pending',
        reference: doc.reference || '',
        transactionId: doc.transactionId || '',
        notes: doc.notes || '',
        createdAt: doc.createdAt || '',
        updatedAt: doc.updatedAt || '',
        createdBy: doc.createdBy || '',
      }));
      
      setPayments(formattedPayments);
      setIsLoading(false);
    }
  }, [data, dataLoading]);

  return { payments, isLoading, error };
};
