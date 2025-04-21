
import { useState, useEffect } from 'react';
import { useCollectionData } from '@/hooks/useCollectionData';
import { useContainersData } from '@/hooks/modules/useContainersData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Invoice } from '../types/accounting-types';
import { orderBy, where, QueryConstraint } from 'firebase/firestore';
import { Container, Shipment } from '@/types/freight';

export const useInvoicesData = (filterStatus?: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Récupérer les conteneurs et expéditions
  const { containers, isLoading: containersLoading } = useContainersData();
  const { data: shipments, isLoading: shipmentsLoading } = useCollectionData(
    COLLECTIONS.FREIGHT.SHIPMENTS,
    [orderBy('createdAt', 'desc')]
  );

  // Préparer les contraintes de requête
  const constraints: QueryConstraint[] = [orderBy('issueDate', 'desc')];
  
  if (filterStatus && filterStatus !== 'all') {
    constraints.push(where('status', '==', filterStatus));
  }

  const { data, isLoading: dataLoading, error } = useCollectionData(
    COLLECTIONS.ACCOUNTING.INVOICES,
    constraints
  );

  useEffect(() => {
    if (!dataLoading && !containersLoading && !shipmentsLoading && data) {
      const formattedInvoices: Invoice[] = data.map((doc: any) => {
        // Chercher le conteneur correspondant
        let containerInfo: Container | undefined;
        let shipmentInfo: Shipment | undefined;
        
        if (doc.containerReference) {
          containerInfo = containers?.find(c => c.number === doc.containerReference);
          // Chercher l'expédition correspondante au conteneur
          shipmentInfo = shipments?.find(s => s.reference === containerInfo?.number);
        }

        return {
          id: doc.id,
          invoiceNumber: doc.invoiceNumber || '',
          number: doc.invoiceNumber || doc.number || '',
          clientName: doc.clientName || containerInfo?.client || shipmentInfo?.customer || '',
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
          containerReference: doc.containerReference || containerInfo?.number || '',
          containerCost: containerInfo?.costs?.[0]?.amount || 0,
          shipmentReference: shipmentInfo?.reference || '',
          shipmentStatus: shipmentInfo?.status || '',
          paymentMethod: doc.paymentMethod || '',
          createdAt: doc.createdAt || '',
          updatedAt: doc.updatedAt || '',
          createdBy: doc.createdBy || '',
        };
      });
      
      setInvoices(formattedInvoices);
      setIsLoading(false);
    }
  }, [data, dataLoading, containers, containersLoading, shipments, shipmentsLoading]);

  return { 
    invoices, 
    isLoading: isLoading || dataLoading || containersLoading || shipmentsLoading, 
    error 
  };
};
