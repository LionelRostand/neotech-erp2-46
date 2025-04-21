
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Container, Shipment } from '@/types/freight';
import { UnifiedTrackingItem } from '@/components/module/submodules/freight/tracking/UnifiedTrackingMap';

const isShipmentReference = (ref: string): boolean => {
  return /^EXP\d{5}$/.test(ref);
};

const isContainerReference = (ref: string): boolean => {
  return /^CT-\d{4}-\d{4}$/.test(ref);
};

const fetchUnifiedTrackingData = async (searchQuery?: string): Promise<UnifiedTrackingItem[]> => {
  const items: UnifiedTrackingItem[] = [];

  if (!searchQuery) return items;

  try {
    // If the search query matches a shipment reference format (EXPxxxxx)
    if (isShipmentReference(searchQuery)) {
      const shipmentsRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
      const shipmentsSnapshot = await getDocs(
        query(shipmentsRef, where('reference', '==', searchQuery))
      );

      shipmentsSnapshot.forEach((doc) => {
        const shipment = doc.data() as Shipment;
        if (shipment.trackingNumber && shipment.origin && shipment.destination) {
          items.push({
            id: doc.id,
            refId: shipment.reference,
            type: 'package',
            label: `Expédition: ${shipment.reference}`,
            status: shipment.status,
            latitude: 48.8566,
            longitude: 2.3522,
            timestamp: shipment.createdAt,
            locationText: shipment.origin
          });
        }
      });
    }

    // If the search query matches a container reference format (CT-2025-3179)
    if (isContainerReference(searchQuery)) {
      const containersRef = collection(db, COLLECTIONS.FREIGHT.CONTAINERS);
      const containersSnapshot = await getDocs(
        query(containersRef, where('number', '==', searchQuery))
      );

      containersSnapshot.forEach((doc) => {
        const container = doc.data() as Container;
        items.push({
          id: doc.id,
          refId: container.number,
          type: 'container',
          label: `Conteneur: ${container.number}`,
          status: container.status,
          latitude: 51.5074,
          longitude: -0.1278,
          timestamp: container.createdAt || new Date().toISOString(),
          locationText: container.location || container.origin
        });
      });
    }

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
