
import { useState, useEffect, useCallback } from 'react';
import { Payment } from '../types/accounting-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy, where, query, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const usePaymentsData = (filterStatus?: string) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPayments = useCallback(async () => {
    setIsLoading(true);
    try {
      let queryConstraints = [];
      
      if (filterStatus && filterStatus !== 'all') {
        queryConstraints.push(where('status', '==', filterStatus));
      }
      
      queryConstraints.push(orderBy('date', 'desc'));
      
      const paymentsQuery = query(
        collection(db, COLLECTIONS.ACCOUNTING.PAYMENTS),
        ...queryConstraints
      );
      
      const snapshot = await getDocs(paymentsQuery);
      
      const fetchedPayments: Payment[] = snapshot.docs.map(doc => ({
        id: doc.id,
        invoiceNumber: doc.data().invoiceNumber || '',
        clientName: doc.data().clientName || '',
        date: doc.data().date || '',
        amount: doc.data().amount || 0,
        currency: doc.data().currency || 'EUR',
        status: doc.data().status || 'pending',
        method: doc.data().method || '',
        transactionId: doc.data().transactionId || '',
        notes: doc.data().notes || '',
        createdAt: doc.data().createdAt || '',
        updatedAt: doc.data().updatedAt || '',
      }));
      
      setPayments(fetchedPayments);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch payments'));
      setIsLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const reload = useCallback(() => {
    fetchPayments();
  }, [fetchPayments]);

  return { payments, isLoading, error, reload };
};
