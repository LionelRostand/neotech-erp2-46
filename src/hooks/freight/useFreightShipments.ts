
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFreightClients } from './useFreightClients';

export interface Shipment {
  id: string;
  reference: string;
  customer: string;
  customerName?: string;
  status?: string; // Make status optional to avoid undefined errors
  totalWeight?: number;
  carrierName: string;
  trackingNumber?: string;
  createdAt: any;
  origin?: string;
  destination?: string;
  carrier?: string;
  scheduledDate?: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  routeId?: string;
  lines?: any[];
  notes?: string;
  totalPrice?: number;
  pricing?: any;
  // Permet d'inclure tous champs additionnels
  [key: string]: any;
}

export const useFreightShipments = () => {
  const { clients, isLoading: clientsLoading } = useFreightClients();

  const { data: shipments = [], isLoading, error } = useQuery({
    queryKey: ['freight', 'shipments', clients],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.SHIPMENTS));
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Recherche nom client prioritairement dans le doc, sinon via clients list
        let customerName = data.customerName || "";
        if (!customerName && data.customer) {
          const found = clients.find(c => c.id === data.customer);
          if (found) customerName = found.name;
        }
        
        // Ensure all expected fields are defined to prevent runtime errors
        return {
          id: doc.id,
          ...data,
          customerName,
          status: data.status || 'draft', // Provide a default status when missing
          carrierName: data.carrierName || data.carrier || "-", // Handle missing carrier info
        } as Shipment;
      });
    },
    enabled: !clientsLoading // Only run this query when clients are loaded
  });

  return {
    shipments,
    isLoading: isLoading || clientsLoading,
    error
  };
};
