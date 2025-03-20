
import { useState, useEffect } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Invoice, InvoiceStatus } from '../types/accounting-types';
import { orderBy, where } from 'firebase/firestore';
import { toast } from 'sonner';

export const useInvoices = (filters?: { status?: InvoiceStatus; clientId?: string; }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const invoicesCollection = useFirestore(COLLECTIONS.ACCOUNTING.INVOICES);

  useEffect(() => {
    const loadInvoices = async () => {
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
        
        // Toujours trier par date de mise à jour
        constraints.push(orderBy('updatedAt', 'desc'));
        
        const data = await invoicesCollection.getAll(constraints);
        
        // Transformer en objets Invoice
        const invoicesData = data.map((doc: any) => ({
          id: doc.id,
          number: doc.number || '',
          clientId: doc.clientId || '',
          clientName: doc.clientName || '',
          issueDate: doc.issueDate || '',
          dueDate: doc.dueDate || '',
          status: doc.status || 'draft',
          items: doc.items || [],
          subtotal: doc.subtotal || 0,
          taxAmount: doc.taxAmount || 0,
          total: doc.total || 0,
          currency: doc.currency || 'EUR',
          notes: doc.notes || '',
          termsAndConditions: doc.termsAndConditions || '',
          fileUrl: doc.fileUrl || '',
          createdAt: doc.createdAt ? new Date(doc.createdAt.seconds * 1000).toISOString() : '',
          updatedAt: doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000).toISOString() : '',
          createdBy: doc.createdBy || '',
        }));
        
        setInvoices(invoicesData);
      } catch (error) {
        console.error('Erreur lors du chargement des factures:', error);
        toast.error('Impossible de charger les factures');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInvoices();
  }, [filters]);
  
  return { invoices, isLoading };
};
