
import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Container, Shipment } from '@/types/freight';
import { UnifiedTrackingItem } from '@/components/module/submodules/freight/tracking/UnifiedTrackingMap';

const normalizeReference = (ref: string): string => {
  return ref.toUpperCase().replace(/\s+/g, '');
};

const isShipmentReference = (ref: string): boolean => {
  const normalized = normalizeReference(ref);
  return /^EXP\d{5}$/.test(normalized);
};

const isContainerReference = (ref: string): boolean => {
  const normalized = normalizeReference(ref);
  return /^CT-\d{4}-\d{4}$/.test(normalized);
};

const getRandomCoordinates = (base: { lat: number, lng: number }, radius: number) => {
  const r = radius * Math.sqrt(Math.random());
  const theta = Math.random() * 2 * Math.PI;
  
  return {
    latitude: base.lat + r * Math.cos(theta),
    longitude: base.lng + r * Math.sin(theta)
  };
};

const fetchUnifiedTrackingData = async (searchQuery?: string): Promise<UnifiedTrackingItem[]> => {
  const items: UnifiedTrackingItem[] = [];

  if (!searchQuery) return items;

  try {
    const normalizedQuery = normalizeReference(searchQuery);
    console.log("Recherche normalisée:", normalizedQuery);

    // Si la référence correspond à un format d'expédition (EXPxxxxx)
    if (isShipmentReference(normalizedQuery)) {
      console.log("Recherche d'expédition:", normalizedQuery);
      const shipmentsRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
      const shipmentsSnapshot = await getDocs(
        query(shipmentsRef, where('reference', '==', normalizedQuery))
      );

      console.log("Résultats d'expédition trouvés:", shipmentsSnapshot.size);
      shipmentsSnapshot.forEach((doc) => {
        const shipment = doc.data() as Shipment;
        // Générer des coordonnées aléatoires autour de Paris pour la démo
        const coords = getRandomCoordinates({ lat: 48.8566, lng: 2.3522 }, 0.1);
        
        if (shipment.reference) {
          items.push({
            id: doc.id,
            refId: shipment.reference,
            type: 'shipment',
            label: `Expédition: ${shipment.reference}`,
            status: shipment.status || 'unknown',
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp: shipment.createdAt,
            locationText: shipment.origin || 'Localisation inconnue'
          });
        }
      });
    }

    // Si la référence correspond à un format de conteneur (CT-2025-3179)
    if (isContainerReference(normalizedQuery)) {
      console.log("Recherche de conteneur:", normalizedQuery);
      const containersRef = collection(db, COLLECTIONS.FREIGHT.CONTAINERS);
      const containersSnapshot = await getDocs(
        query(containersRef, where('number', '==', normalizedQuery))
      );

      console.log("Résultats de conteneur trouvés:", containersSnapshot.size);
      containersSnapshot.forEach((doc) => {
        const container = doc.data() as Container;
        // Générer des coordonnées aléatoires autour de Londres pour la démo
        const coords = getRandomCoordinates({ lat: 51.5074, lng: -0.1278 }, 0.1);
        
        items.push({
          id: doc.id,
          refId: container.number,
          type: 'container',
          label: `Conteneur: ${container.number}`,
          status: container.status,
          latitude: coords.latitude,
          longitude: coords.longitude,
          timestamp: container.createdAt || new Date().toISOString(),
          locationText: container.location || 'Localisation inconnue'
        });
      });
    }

    console.log("Total des éléments trouvés:", items.length);
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
