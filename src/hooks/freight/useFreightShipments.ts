
import { useFirebaseCollection } from '@/hooks/useFirebaseCollection';
import { COLLECTIONS } from '@/lib/firebase-collections';
import type { Shipment } from '@/types/freight';

export const useFreightShipments = () => {
  const { data: shipments, isLoading, error } = useFirebaseCollection<Shipment>(
    COLLECTIONS.FREIGHT.SHIPMENTS
  );

  return {
    shipments,
    isLoading,
    error
  };
};
