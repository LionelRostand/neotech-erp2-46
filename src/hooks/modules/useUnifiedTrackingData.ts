
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Container, Shipment } from '@/types/freight';
import { UnifiedTrackingItem } from '@/components/module/submodules/freight/tracking/UnifiedTrackingMap';

const fetchUnifiedTrackingData = async (searchQuery?: string): Promise<UnifiedTrackingItem[]> => {
  const items: UnifiedTrackingItem[] = [];

  try {
    // Fetch shipments
    const shipmentsRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
    const shipmentsQuery = searchQuery 
      ? query(shipmentsRef, where('reference', '==', searchQuery))
      : query(shipmentsRef);
    const shipmentsSnapshot = await getDocs(shipmentsQuery);

    shipmentsSnapshot.forEach((doc) => {
      const shipment = doc.data() as Shipment;
      if (shipment.trackingNumber && shipment.origin && shipment.destination) {
        items.push({
          id: doc.id,
          refId: shipment.reference,
          type: 'package',
          label: `Expédition: ${shipment.reference}`,
          status: shipment.status,
          // Using origin coordinates for demo - in real app, would use actual tracking data
          latitude: 48.8566, // Paris coordinates for demo
          longitude: 2.3522,
          timestamp: shipment.createdAt,
          locationText: shipment.origin
        });
      }
    });

    // Fetch containers
    const containersRef = collection(db, COLLECTIONS.FREIGHT.CONTAINERS);
    const containersQuery = searchQuery 
      ? query(containersRef, where('number', '==', searchQuery))
      : query(containersRef);
    const containersSnapshot = await getDocs(containersQuery);

    containersSnapshot.forEach((doc) => {
      const container = doc.data() as Container;
      items.push({
        id: doc.id,
        refId: container.number,
        type: 'container',
        label: `Conteneur: ${container.number}`,
        status: container.status,
        // Using origin coordinates for demo - in real app, would use actual tracking data
        latitude: 51.5074, // London coordinates for demo
        longitude: -0.1278,
        timestamp: container.createdAt || new Date().toISOString(),
        locationText: container.location || container.origin
      });
    });

    return items;

  } catch (error) {
    console.error('Erreur lors de la récupération des données de suivi:', error);
    throw error;
  }
};

export const useUnifiedTrackingData = (searchQuery?: string) => {
  return useQuery({
    queryKey: ['unifiedTracking', searchQuery],
    queryFn: () => fetchUnifiedTrackingData(searchQuery),
    enabled: !!searchQuery,
  });
};
