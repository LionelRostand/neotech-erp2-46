
import { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Invoice } from '../types/accounting-types';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';

export const useInvoicesData = (filterStatus?: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Préparer les contraintes de requête
  const constraints: QueryConstraint[] = [orderBy('issueDate', 'desc')];
  
  if (filterStatus) {
    constraints.push(where('status', '==', filterStatus));
  }

  // Utiliser le hook useCollectionData pour récupérer les données en temps réel
  const { data, isLoading: dataLoading, error } = useCollectionData(
    COLLECTIONS.ACCOUNTING.INVOICES,
    constraints
  );

  useEffect(() => {
    if (!dataLoading && data) {
      // Transformer les données en objets Invoice
      const formattedInvoices: Invoice[] = data.map((doc: any) => ({
        id: doc.id,
        invoiceNumber: doc.invoiceNumber || '',
        number: doc.invoiceNumber || doc.number || '',
        clientName: doc.clientName || '',
        clientId: doc.clientId || '',
        issueDate: doc.issueDate || '',
        dueDate: doc.dueDate || '',
        total: doc.total || 0,
        status: doc.status || 'pending',
        currency: doc.currency || 'EUR',
        items: doc.items || [],
        subtotal: doc.subtotal || 0,
        taxRate: doc.taxRate || 0,
        taxAmount: doc.taxAmount || 0,
        notes: doc.notes || '',
        termsAndConditions: doc.termsAndConditions || '',
        createdAt: doc.createdAt || '',
        updatedAt: doc.updatedAt || '',
        createdBy: doc.createdBy || '',
      }));
      
      setInvoices(formattedInvoices);
      setIsLoading(false);
    }
  }, [data, dataLoading]);

  return { invoices, isLoading, error };
};
