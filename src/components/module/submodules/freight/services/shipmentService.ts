
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Shipment, ShipmentLine, TrackingEvent, PackageStatus, GeoLocation } from '@/types/freight';
import { toast } from '@/hooks/use-toast';

// Convertir une date string en Timestamp pour Firebase
const toFirebaseTimestamp = (dateString?: string) => {
  if (!dateString) return null;
  return Timestamp.fromDate(new Date(dateString));
};

// Créer une nouvelle expédition
export const createShipment = async (shipmentData: Omit<Shipment, 'id' | 'createdAt'>) => {
  try {
    // Préparer les données pour Firebase
    const shipmentForFirebase = {
      ...shipmentData,
      createdAt: serverTimestamp(),
      scheduledDate: toFirebaseTimestamp(shipmentData.scheduledDate),
      estimatedDeliveryDate: toFirebaseTimestamp(shipmentData.estimatedDeliveryDate),
      actualDeliveryDate: shipmentData.actualDeliveryDate ? toFirebaseTimestamp(shipmentData.actualDeliveryDate) : null,
      status: shipmentData.status || 'draft',
    };
    
    // Ajouter un document d'expédition
    const shipmentsCollectionRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
    const docRef = await addDoc(shipmentsCollectionRef, shipmentForFirebase);
    
    // Créer un événement de suivi initial
    if (shipmentData.trackingNumber) {
      const trackingCollectionRef = collection(db, COLLECTIONS.FREIGHT.TRACKING);
      await addDoc(trackingCollectionRef, {
        shipmentId: docRef.id,
        trackingNumber: shipmentData.trackingNumber,
        status: 'registered',
        currentLocation: shipmentData.origin,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
      
      // Créer le premier événement de suivi
      const eventsCollectionRef = collection(db, COLLECTIONS.FREIGHT.TRACKING_EVENTS);
      await addDoc(eventsCollectionRef, {
        shipmentId: docRef.id,
        packageId: shipmentData.trackingNumber,
        timestamp: serverTimestamp(),
        status: 'registered' as PackageStatus,
        location: {
          address: shipmentData.origin,
        } as GeoLocation,
        description: 'Expédition enregistrée',
        isNotified: false
      });
    }
    
    toast({
      title: "Expédition créée",
      description: `L'expédition a été enregistrée avec succès. Référence: ${shipmentData.reference}`,
    });
    
    return { id: docRef.id, ...shipmentData };
  } catch (error) {
    console.error('Erreur lors de la création de l\'expédition:', error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la création de l'expédition.",
      variant: "destructive",
    });
    throw error;
  }
};

// Mettre à jour une expédition existante
export const updateShipment = async (id: string, shipmentData: Partial<Shipment>) => {
  try {
    const shipmentDocRef = doc(db, COLLECTIONS.FREIGHT.SHIPMENTS, id);
    
    // Préparer les données pour Firebase
    const updateData: any = {
      ...shipmentData,
      updatedAt: serverTimestamp()
    };
    
    // Convertir les dates en Timestamp
    if (shipmentData.scheduledDate) {
      updateData.scheduledDate = toFirebaseTimestamp(shipmentData.scheduledDate);
    }
    
    if (shipmentData.estimatedDeliveryDate) {
      updateData.estimatedDeliveryDate = toFirebaseTimestamp(shipmentData.estimatedDeliveryDate);
    }
    
    if (shipmentData.actualDeliveryDate) {
      updateData.actualDeliveryDate = toFirebaseTimestamp(shipmentData.actualDeliveryDate);
    }
    
    await updateDoc(shipmentDocRef, updateData);
    
    toast({
      title: "Expédition mise à jour",
      description: "L'expédition a été mise à jour avec succès.",
    });
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'expédition:', error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la mise à jour de l'expédition.",
      variant: "destructive",
    });
    throw error;
  }
};

// Supprimer une expédition
export const deleteShipment = async (id: string) => {
  try {
    const shipmentDocRef = doc(db, COLLECTIONS.FREIGHT.SHIPMENTS, id);
    await deleteDoc(shipmentDocRef);
    
    // Supprimer également les données de suivi associées
    const trackingCollectionRef = collection(db, COLLECTIONS.FREIGHT.TRACKING);
    const trackingQuery = query(trackingCollectionRef, where("shipmentId", "==", id));
    const trackingSnapshot = await getDocs(trackingQuery);
    
    for (const doc of trackingSnapshot.docs) {
      await deleteDoc(doc.ref);
    }
    
    // Supprimer les événements de suivi
    const eventsCollectionRef = collection(db, COLLECTIONS.FREIGHT.TRACKING_EVENTS);
    const eventsQuery = query(eventsCollectionRef, where("shipmentId", "==", id));
    const eventsSnapshot = await getDocs(eventsQuery);
    
    for (const doc of eventsSnapshot.docs) {
      await deleteDoc(doc.ref);
    }
    
    toast({
      title: "Expédition supprimée",
      description: "L'expédition et ses données de suivi ont été supprimées avec succès.",
    });
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'expédition:', error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de la suppression de l'expédition.",
      variant: "destructive",
    });
    throw error;
  }
};

// Ajouter un nouvel événement de suivi
export const addTrackingEvent = async (trackingEvent: Omit<TrackingEvent, 'id'>) => {
  try {
    // Préparer les données pour Firebase
    const trackingEventForFirebase = {
      ...trackingEvent,
      timestamp: trackingEvent.timestamp ? toFirebaseTimestamp(trackingEvent.timestamp) : serverTimestamp(),
      isNotified: trackingEvent.isNotified || false
    };
    
    // Ajouter l'événement
    const eventsCollectionRef = collection(db, COLLECTIONS.FREIGHT.TRACKING_EVENTS);
    await addDoc(eventsCollectionRef, trackingEventForFirebase);
    
    // Mettre à jour le statut de suivi principal
    const trackingCollectionRef = collection(db, COLLECTIONS.FREIGHT.TRACKING);
    const trackingQuery = query(trackingCollectionRef, where("packageId", "==", trackingEvent.packageId));
    const trackingSnapshot = await getDocs(trackingQuery);
    
    if (!trackingSnapshot.empty) {
      const trackingDoc = trackingSnapshot.docs[0];
      await updateDoc(trackingDoc.ref, {
        status: trackingEvent.status,
        currentLocation: trackingEvent.location?.address || null,
        lastUpdated: serverTimestamp()
      });
    }
    
    // Mettre à jour l'expédition si le statut est terminal (livré)
    if (trackingEvent.status === 'delivered') {
      const shipmentsCollectionRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
      const shipmentsQuery = query(shipmentsCollectionRef, where("trackingNumber", "==", trackingEvent.packageId));
      const shipmentsSnapshot = await getDocs(shipmentsQuery);
      
      if (!shipmentsSnapshot.empty) {
        const shipmentDoc = shipmentsSnapshot.docs[0];
        await updateDoc(shipmentDoc.ref, {
          status: 'delivered',
          actualDeliveryDate: serverTimestamp()
        });
      }
    }
    
    toast({
      title: "Événement de suivi ajouté",
      description: "L'événement de suivi a été ajouté avec succès.",
    });
    
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'ajout de l\'événement de suivi:', error);
    toast({
      title: "Erreur",
      description: "Une erreur est survenue lors de l'ajout de l'événement de suivi.",
      variant: "destructive",
    });
    throw error;
  }
};

// Récupérer une expédition par son ID
export const getShipmentById = async (id: string): Promise<Shipment | null> => {
  try {
    const shipmentDocRef = doc(db, COLLECTIONS.FREIGHT.SHIPMENTS, id);
    const shipmentDoc = await getDoc(shipmentDocRef);
    
    if (!shipmentDoc.exists()) {
      return null;
    }
    
    const data = shipmentDoc.data();
    
    // Convertir les Timestamps en dates
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
      id: shipmentDoc.id,
      ...data,
      createdAt,
      scheduledDate,
      estimatedDeliveryDate,
      actualDeliveryDate
    } as Shipment;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'expédition:', error);
    throw error;
  }
};
