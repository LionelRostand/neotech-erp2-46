
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFreightClients } from './useFreightClients';

export interface Shipment {
  id: string;
  reference: string;
  customerId: string;
  customerName?: string;
  status: string;
  weight: number;
  weightUnit: string;
  carrierName: string;
  trackingNumber: string;
  createdAt: any; // Can be a Firebase timestamp or string
  labelGenerated: boolean;
  documents: any[];
  description: string;
  origin?: string;
  destination?: string;
}

export const useFreightShipments = () => {
  const { clients, isLoading: clientsLoading } = useFreightClients();

  const { data: shipments = [], isLoading, error } = useQuery({
    queryKey: ['freight', 'shipments', clients],
    queryFn: async () => {
      console.log('Fetching shipments with clients:', clients.length);
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.SHIPMENTS));
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const customerId = data.customerId || '';
        const customer = clients.find(c => c.id === customerId);
        
        console.log('Shipment:', doc.id, 'customerId:', customerId, 'customerName:', customer?.name || 'Not found');
        
        return {
          id: doc.id,
          reference: data.reference || '',
          customerId: customerId,
          customerName: customer?.name || '',
          status: data.status || '',
          weight: data.weight || 0,
          weightUnit: data.weightUnit || 'kg',
          carrierName: data.carrierName || '',
          trackingNumber: data.trackingNumber || '',
          createdAt: data.createdAt || '',
          labelGenerated: data.labelGenerated || false,
          documents: data.documents || [],
          description: data.description || '',
          origin: data.origin || '',
          destination: data.destination || ''
        } as Shipment;
      });
    },
    enabled: true // Always enabled, the query will wait for clients internally
  });

  return { 
    shipments, 
    isLoading: isLoading || clientsLoading,
    error 
  };
};
