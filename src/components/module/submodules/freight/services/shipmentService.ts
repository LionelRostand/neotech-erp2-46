
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Shipment, ShipmentLine, TrackingEvent, PackageStatus, GeoLocation } from '@/types/freight';
import { toast } from '@/hooks/use-toast';
import { addDocument } from '@/hooks/firestore/create-operations';

// Créer une nouvelle expédition
export const createShipment = async (shipmentData: Omit<Shipment, 'id' | 'createdAt'>) => {
  try {
    // Ajouter un document d'expédition
    const result = await addDocument(COLLECTIONS.FREIGHT.SHIPMENTS, {
      ...shipmentData,
      createdAt: new Date().toISOString(),
      status: shipmentData.status || 'draft',
    });
    
    // Créer un événement de suivi initial
    if (shipmentData.trackingNumber) {
      await addDocument(COLLECTIONS.FREIGHT.TRACKING, {
        shipmentId: result.id,
        trackingNumber: shipmentData.trackingNumber,
        status: 'registered',
        currentLocation: shipmentData.origin,
      });
      
      // Créer le premier événement de suivi
      await addDocument(COLLECTIONS.FREIGHT.TRACKING_EVENTS, {
        shipmentId: result.id,
        packageId: shipmentData.trackingNumber,
        timestamp: new Date().toISOString(),
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
    
    return result;
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
    const shipmentFirestore = useFirestore(COLLECTIONS.FREIGHT.SHIPMENTS);
    await shipmentFirestore.update(id, {
      ...shipmentData,
      updatedAt: new Date().toISOString()
    });
    
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
    const shipmentFirestore = useFirestore(COLLECTIONS.FREIGHT.SHIPMENTS);
    await shipmentFirestore.remove(id);  // Utilisez remove au lieu de delete
    
    // Supprimer également les données de suivi associées
    const trackingFirestore = useFirestore(COLLECTIONS.FREIGHT.TRACKING);
    // Comme nous n'avons pas de méthode query, récupérons tous les documents et filtrons côté client
    const trackingAll = await trackingFirestore.getAll();
    const trackingData = trackingAll.filter(doc => doc.shipmentId === id);
    
    // Supprimer les documents de suivi
    for (const doc of trackingData) {
      await trackingFirestore.remove(doc.id);  // Utilisez remove au lieu de delete
    }
    
    // Supprimer les événements de suivi
    const eventsFirestore = useFirestore(COLLECTIONS.FREIGHT.TRACKING_EVENTS);
    // Comme nous n'avons pas de méthode query, récupérons tous les documents et filtrons côté client
    const eventsAll = await eventsFirestore.getAll();
    const eventsData = eventsAll.filter(event => event.shipmentId === id);
    
    for (const event of eventsData) {
      await eventsFirestore.remove(event.id);  // Utilisez remove au lieu de delete
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
    // Ajouter l'événement
    await addDocument(COLLECTIONS.FREIGHT.TRACKING_EVENTS, {
      ...trackingEvent,
      timestamp: trackingEvent.timestamp || new Date().toISOString(),
      isNotified: trackingEvent.isNotified || false
    });
    
    // Mettre à jour le statut de suivi principal
    const trackingFirestore = useFirestore(COLLECTIONS.FREIGHT.TRACKING);
    // Comme nous n'avons pas de méthode query, récupérons tous les documents et filtrons côté client
    const trackingAll = await trackingFirestore.getAll();
    const trackingData = trackingAll.filter(doc => doc.packageId === trackingEvent.packageId);
    
    if (trackingData.length > 0) {
      await trackingFirestore.update(trackingData[0].id, {
        status: trackingEvent.status,
        currentLocation: trackingEvent.location?.address || null,
        lastUpdated: new Date().toISOString()
      });
    }
    
    // Mettre à jour l'expédition si le statut est terminal (livré)
    if (trackingEvent.status === 'delivered') {
      const shipmentFirestore = useFirestore(COLLECTIONS.FREIGHT.SHIPMENTS);
      // Comme nous n'avons pas de méthode query, récupérons tous les documents et filtrons côté client
      const shipmentsAll = await shipmentFirestore.getAll();
      const shipmentsData = shipmentsAll.filter(doc => doc.trackingNumber === trackingEvent.packageId);
      
      if (shipmentsData.length > 0) {
        await shipmentFirestore.update(shipmentsData[0].id, {
          status: 'delivered',
          actualDeliveryDate: new Date().toISOString()
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
