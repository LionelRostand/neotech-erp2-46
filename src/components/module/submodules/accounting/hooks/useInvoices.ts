
import { useState, useEffect, useCallback } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Invoice } from '../types/accounting-types';
import { orderBy, where } from 'firebase/firestore';
import { toast } from 'sonner';

export const useInvoices = (filters?: { status?: string; clientId?: string; }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const invoicesCollection = useFirestore(COLLECTIONS.ACCOUNTING.INVOICES);

  const loadInvoices = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Construire les contraintes de requête
      const constraints = [];
      
      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }
      
      if (filters?.clientId) {
        constraints.push(where('clientId', '==', filters.clientId));
      }
      
      // Toujours trier par date d'émission
      constraints.push(orderBy('issueDate', 'desc'));
      
      const data = await invoicesCollection.getAll(constraints);
      
      // Transformer en objets Invoice
      const invoicesData = data.map((doc: any) => ({
        id: doc.id,
        number: doc.invoiceNumber || '',  // Ensuring type compatibility with Invoice
        invoiceNumber: doc.invoiceNumber || '',
        clientId: doc.clientId || '',
        clientName: doc.clientName || '',
        issueDate: doc.issueDate || '',
        dueDate: doc.dueDate || '',
        items: doc.items || [],
        subtotal: doc.subtotal || 0,
        taxRate: doc.taxRate || 0,
        taxAmount: doc.taxAmount || 0,
        total: doc.total || 0,
        status: doc.status || 'pending',
        notes: doc.notes || '',
        currency: doc.currency || 'EUR',
        createdAt: doc.createdAt ? new Date(doc.createdAt.seconds * 1000).toISOString() : '',
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000).toISOString() : '',
        createdBy: doc.createdBy || '',
      }));
      
      setInvoices(invoicesData as Invoice[]);
    } catch (error) {
      console.error('Erreur lors du chargement des factures:', error);
      toast.error('Impossible de charger les factures');
    } finally {
      setIsLoading(false);
    }
  }, [filters, invoicesCollection]);
  
  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);
  
  return { invoices, isLoading, reload: loadInvoices };
};
