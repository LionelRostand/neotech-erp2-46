
import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, Timestamp, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Shipment } from '@/types/freight';
import { toast } from 'sonner';

export const useShipments = (filter: 'all' | 'ongoing' | 'delivered' | 'delayed') => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Reference to the shipments collection
    const shipmentsRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
    
    // Solution: Fetch all shipments with only orderBy, then filter in memory
    // This avoids the need for a composite index
    const q = query(shipmentsRef, orderBy('createdAt', 'desc'));
    
    setIsLoading(true);
    
    // Setup real-time listener
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const shipmentsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Convert Timestamp to string ISO if necessary
          const createdAt = data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString() 
            : data.createdAt;
          
          const scheduledDate = data.scheduledDate instanceof Timestamp 
            ? data.scheduledDate.toDate().toISOString() 
            : data.scheduledDate;
          
          const estimatedDeliveryDate = data.estimatedDeliveryDate instanceof Timestamp 
            ? data.estimatedDeliveryDate.toDate().toISOString() 
            : data.estimatedDeliveryDate;
          
          const actualDeliveryDate = data.actualDeliveryDate instanceof Timestamp 
            ? data.actualDeliveryDate.toDate().toISOString() 
            : data.actualDeliveryDate;
          
          return {
            id: doc.id,
            ...data,
            createdAt,
            scheduledDate,
            estimatedDeliveryDate,
            actualDeliveryDate,
            // Default values to avoid errors
            reference: data.reference || `REF-${doc.id.substring(0, 6)}`,
            origin: data.origin || 'Non spécifié',
            destination: data.destination || 'Non spécifié',
            customer: data.customer || 'Client',
            carrier: data.carrier || '',
            carrierName: data.carrierName || 'Non spécifié',
            shipmentType: data.shipmentType || 'export',
            status: data.status || 'draft',
            lines: data.lines || [],
            totalWeight: data.totalWeight || 0
          } as Shipment;
        });
        
        // Filter the data in memory instead of in Firestore query
        let filteredShipments = shipmentsData;
        
        if (filter === 'ongoing') {
          filteredShipments = shipmentsData.filter(
            shipment => ['confirmed', 'in_transit'].includes(shipment.status)
          );
        } else if (filter === 'delivered') {
          filteredShipments = shipmentsData.filter(
            shipment => shipment.status === 'delivered'
          );
        } else if (filter === 'delayed') {
          filteredShipments = shipmentsData.filter(
            shipment => shipment.status === 'delayed'
          );
        }
        
        setShipments(filteredShipments);
        setIsLoading(false);
        console.log(`Loaded ${filteredShipments.length} shipments (filter: ${filter}) from ${shipmentsData.length} total`);
      },
      (error) => {
        console.error('Error loading shipments:', error);
        setError(error as Error);
        setIsLoading(false);
        toast.error("Erreur lors du chargement des expéditions");
      }
    );

    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, [filter]);

  return { shipments, isLoading, error };
};
