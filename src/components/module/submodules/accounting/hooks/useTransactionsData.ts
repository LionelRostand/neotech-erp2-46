
import { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Transaction } from '../types/accounting-types';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';

export const useTransactionsData = (filterType?: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Préparer les contraintes de requête
  const constraints: QueryConstraint[] = [orderBy('date', 'desc')];
  
  if (filterType) {
    constraints.push(where('type', '==', filterType));
  }

  // Utiliser le hook useCollectionData pour récupérer les données en temps réel
  const { data, isLoading: dataLoading, error } = useCollectionData(
    COLLECTIONS.ACCOUNTING.TRANSACTIONS,
    constraints
  );

  useEffect(() => {
    if (!dataLoading && data) {
      // Transformer les données en objets Transaction
      const formattedTransactions: Transaction[] = data.map((doc: any) => ({
        id: doc.id,
        date: doc.date || '',
        description: doc.description || '',
        amount: doc.amount || 0,
        type: doc.type || 'expense',
        category: doc.category || '',
        account: doc.account || '',
        isReconciled: doc.isReconciled || false,
        reference: doc.reference || '',
        notes: doc.notes || '',
        currency: doc.currency || 'EUR',
        createdAt: doc.createdAt || '',
        updatedAt: doc.updatedAt || '',
      }));
      
      setTransactions(formattedTransactions);
      setIsLoading(false);
    }
  }, [data, dataLoading]);

  return { transactions, isLoading, error };
};
