
import { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { useContainersData } from '@/hooks/modules/useContainersData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Invoice } from '../types/accounting-types';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';
import { Container } from '@/types/freight';

export const useInvoicesData = (filterStatus?: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les conteneurs
  const { containers, isLoading: containersLoading } = useContainersData();

  // Préparer les contraintes de requête
  const constraints: QueryConstraint[] = [orderBy('issueDate', 'desc')];
  
  if (filterStatus && filterStatus !== 'all') {
    constraints.push(where('status', '==', filterStatus));
  }

  // Utiliser le hook useCollectionData pour récupérer les données en temps réel
  const { data, isLoading: dataLoading, error } = useCollectionData(
    COLLECTIONS.ACCOUNTING.INVOICES,
    constraints
  );

  useEffect(() => {
    if (!dataLoading && !containersLoading && data) {
      // Transformer les données en objets Invoice avec les infos des conteneurs
      const formattedInvoices: Invoice[] = data.map((doc: any) => {
        // Chercher le conteneur correspondant
        let containerInfo: Container | undefined;
        if (doc.containerReference) {
          containerInfo = containers?.find(c => c.number === doc.containerReference);
        }

        return {
          id: doc.id,
          invoiceNumber: doc.invoiceNumber || '',
          number: doc.invoiceNumber || doc.number || '',
          clientName: doc.clientName || '',
          clientId: doc.clientId || '',
          clientEmail: doc.clientEmail || '',
          issueDate: doc.issueDate || '',
          dueDate: doc.dueDate || '',
          total: doc.total || 0,
          status: doc.status || 'pending',
          currency: doc.currency || 'EUR',
          items: doc.items || [],
          subtotal: doc.subtotal || 0,
          tax: doc.tax || 0,
          taxRate: doc.taxRate || 0,
          taxAmount: doc.taxAmount || 0,
          discountAmount: doc.discountAmount || 0,
          discountRate: doc.discountRate || 0,
          notes: doc.notes || '',
          termsAndConditions: doc.termsAndConditions || '',
          // Ajouter les informations du conteneur si trouvées
          containerReference: doc.containerReference || containerInfo?.number || '',
          containerCost: containerInfo?.costs?.[0]?.amount || 0,
          createdAt: doc.createdAt || '',
          updatedAt: doc.updatedAt || '',
          createdBy: doc.createdBy || '',
        };
      });
      
      setInvoices(formattedInvoices);
      setIsLoading(false);
    }
  }, [data, dataLoading, containers, containersLoading]);

  return { invoices, isLoading: isLoading || dataLoading || containersLoading, error };
};
