
import { collection, addDoc, doc, Timestamp, updateDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Shipment } from '@/types/freight';
import { toast } from 'sonner';

/**
 * Create a new shipment in Firestore
 */
export const createShipment = async (shipmentData: Omit<Shipment, 'id' | 'createdAt' | 'actualDeliveryDate'>): Promise<Shipment> => {
  try {
    console.log('Creating shipment with data:', shipmentData);
    
    // Use the freight_shipments collection path from COLLECTIONS
    const shipmentsCollectionRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
    
    // Prepare the data with timestamps
    const now = Timestamp.now();
    const scheduledDate = new Date(shipmentData.scheduledDate);
    const estimatedDeliveryDate = new Date(shipmentData.estimatedDeliveryDate);
    
    const newShipmentData = {
      ...shipmentData,
      createdAt: now,
      scheduledDate: Timestamp.fromDate(scheduledDate),
      estimatedDeliveryDate: Timestamp.fromDate(estimatedDeliveryDate),
      status: shipmentData.status || 'draft',
    };
    
    // Add the document to Firestore
    const docRef = await addDoc(shipmentsCollectionRef, newShipmentData);
    
    // Create the returned shipment with the generated ID
    const newShipment: Shipment = {
      id: docRef.id,
      ...shipmentData,
      createdAt: now.toDate().toISOString(),
    };
    
    console.log('Shipment created successfully with ID:', docRef.id);
    toast.success(`Expédition ${shipmentData.reference} créée avec succès`);
    
    return newShipment;
  } catch (error) {
    console.error('Error creating shipment:', error);
    toast.error('Erreur lors de la création de l\'expédition');
    throw error;
  }
};
