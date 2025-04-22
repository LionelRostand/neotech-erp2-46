
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFreightClients } from './useFreightClients';

export interface Shipment {
  id: string;
  reference: string;
  customerId: string;
  customerName?: string; // Nom du client
  status: string;
  weight: number;
  weightUnit: string;
  carrierName: string;
  trackingNumber: string;
  createdAt: string;
  labelGenerated: boolean;
  documents: any[];
  description: string;
}

export const useFreightShipments = () => {
  const { clients } = useFreightClients();

  const { data: shipments = [], isLoading, error } = useQuery({
    queryKey: ['freight', 'shipments'],
    queryFn: async () => {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.FREIGHT.SHIPMENTS));
      
      // Ajoutons des logs pour déboguer
      console.log('Clients disponibles:', clients);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        const customer = clients.find(c => c.id === data.customerId);
        
        // Ajoutons un log pour chaque shipment
        console.log('Shipment data:', data.customerId, 'Customer found:', customer?.name || 'None');
        
        return {
          id: doc.id,
          reference: data.reference || '',
          customerId: data.customerId || '',
          customerName: customer?.name || '', // Utiliser une chaîne vide si aucun nom trouvé
          status: data.status || '',
          weight: data.weight || 0,
          weightUnit: data.weightUnit || 'kg',
          carrierName: data.carrierName || '',
          trackingNumber: data.trackingNumber || '',
          createdAt: data.createdAt || '',
          labelGenerated: data.labelGenerated || false,
          documents: data.documents || [],
          description: data.description || ''
        } as Shipment;
      });
    },
    enabled: clients.length > 0 // Seulement exécuter la requête après que les clients sont chargés
  });

  return { shipments, isLoading, error };
};
