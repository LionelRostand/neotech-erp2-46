
import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, Timestamp, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Shipment } from '@/types/freight';
import { useToast } from '@/hooks/use-toast';

export const useShipments = (filter: 'all' | 'ongoing' | 'delivered' | 'delayed') => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true);
      try {
        // Properly reference a subcollection in Firestore
        // For 'freight/shipments', we use: collection(db, 'freight', 'freight', 'shipments')
        const freightDocRef = doc(db, 'freight', 'freight');
        const shipmentsRef = collection(freightDocRef, 'shipments');
        const q = query(shipmentsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const shipmentsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Convertir Timestamp en string ISO si nécessaire
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
            // Valeurs par défaut pour éviter les erreurs
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
        
        // Filtrer les expéditions selon le filtre sélectionné
        let filteredShipments = shipmentsData;
        if (filter === 'ongoing') {
          filteredShipments = shipmentsData.filter(s => 
            ['confirmed', 'in_transit'].includes(s.status));
        } else if (filter === 'delivered') {
          filteredShipments = shipmentsData.filter(s => s.status === 'delivered');
        } else if (filter === 'delayed') {
          filteredShipments = shipmentsData.filter(s => s.status === 'delayed');
        }
        
        setShipments(filteredShipments);
        console.log(`Chargement de ${filteredShipments.length} expéditions (filtre: ${filter})`);
      } catch (err) {
        console.error('Erreur lors du chargement des expéditions:', err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        toast({
          title: "Erreur",
          description: "Impossible de charger les expéditions",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchShipments();
  }, [filter, toast]);

  return { shipments, isLoading, error };
};
