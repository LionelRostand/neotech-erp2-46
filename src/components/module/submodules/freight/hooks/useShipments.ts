
import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Shipment } from '@/types/freight';
import { toast } from 'sonner';
import { isOnline, restoreFirestoreConnectivity } from '@/hooks/firestore/network-operations';

export const useShipments = (filter: 'all' | 'ongoing' | 'delivered' | 'delayed') => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Function to retry the query if there's an error
  const retryQuery = async () => {
    setError(null);
    setIsLoading(true);
    
    if (!isOnline()) {
      toast.error("Vous êtes hors ligne. Veuillez vérifier votre connexion internet.");
      setError(new Error("Vous êtes hors ligne"));
      setIsLoading(false);
      return;
    }

    try {
      // Attempt to restore connectivity
      await restoreFirestoreConnectivity();
      // Refresh the component to trigger a new query
      setupShipmentListener();
    } catch (error) {
      console.error("Failed to restore connectivity:", error);
      setError(error as Error);
      setIsLoading(false);
    }
  };

  const setupShipmentListener = () => {
    try {
      // Reference to the shipments collection
      const shipmentsRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
      
      // Query with only orderBy - no filtering in the Firestore query
      // This prevents the need for composite indexes
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
          
          // Filter the data in memory (client-side filtering)
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
          setError(null); // Clear any previous errors on successful data fetch
          console.log(`Loaded ${filteredShipments.length} shipments (filter: ${filter}) from ${shipmentsData.length} total`);
        },
        (error) => {
          console.error('Error loading shipments:', error);
          setError(error as Error);
          setIsLoading(false);
          
          // Check if the error is about indexes
          if (error.message && error.message.includes('index')) {
            toast.error("Erreur d'index Firestore. Le filtrage s'effectue désormais côté client.");
            // Try to get the data without filtering
            const unindexedQuery = query(shipmentsRef, orderBy('createdAt', 'desc'));
            
            getDocs(unindexedQuery)
              .then((snapshot) => {
                // Process data the same way as above but without filtering first
                const allShipments = snapshot.docs.map(doc => {
                  // ... same data processing as above
                  const data = doc.data();
                  return {
                    id: doc.id,
                    ...data,
                    // ... same default values and conversions as above
                  } as Shipment;
                });
                
                // Then filter manually
                let filteredResults = allShipments;
                if (filter !== 'all') {
                  // Apply the same filters as above
                  if (filter === 'ongoing') {
                    filteredResults = allShipments.filter(
                      shipment => ['confirmed', 'in_transit'].includes(shipment.status)
                    );
                  } else if (filter === 'delivered') {
                    filteredResults = allShipments.filter(
                      shipment => shipment.status === 'delivered'
                    );
                  } else if (filter === 'delayed') {
                    filteredResults = allShipments.filter(
                      shipment => shipment.status === 'delayed'
                    );
                  }
                }
                
                setShipments(filteredResults);
                setIsLoading(false);
                toast.success("Données récupérées avec succès en mode alternatif");
              })
              .catch((fallbackError) => {
                console.error('Error in fallback query:', fallbackError);
                toast.error("Erreur lors du chargement des données en mode alternatif");
              });
          } else {
            toast.error("Erreur lors du chargement des expéditions");
          }
        }
      );

      // Cleanup function to unsubscribe when component unmounts
      return () => unsubscribe();
    } catch (error) {
      console.error('Error setting up shipments listener:', error);
      setError(error as Error);
      setIsLoading(false);
      toast.error("Erreur lors de l'initialisation du suivi des expéditions");
      // Return empty cleanup function
      return () => {};
    }
  };

  useEffect(() => {
    const unsubscribe = setupShipmentListener();
    
    // Cleanup function
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [filter]);

  return { shipments, isLoading, error, retry: retryQuery };
};
