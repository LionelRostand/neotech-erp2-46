
import { useState, useEffect } from 'react';
import { Payment } from '../types/accounting-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { orderBy } from 'firebase/firestore';
import { useCollectionData } from '@/hooks/useCollectionData';

export const usePaymentsData = (filterStatus?: string) => {
  const constraints = filterStatus && filterStatus !== 'all' 
    ? [orderBy('date', 'desc'), where('status', '==', filterStatus)] 
    : [orderBy('date', 'desc')];

  const { data, isLoading, error } = useCollectionData(
    COLLECTIONS.ACCOUNTING.PAYMENTS, 
    constraints
  );

  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    if (data) {
      const formattedPayments: Payment[] = data.map((doc: any) => ({
        id: doc.id,
        invoiceNumber: doc.invoiceNumber || '',
        clientName: doc.clientName || '',
        date: doc.date || '',
        amount: doc.amount || 0,
        currency: doc.currency || 'EUR',
        status: doc.status || 'pending',
        method: doc.method || '',
        transactionId: doc.transactionId || ''
      }));
      setPayments(formattedPayments);
    }
  }, [data]);

  return { payments, isLoading, error };
};
