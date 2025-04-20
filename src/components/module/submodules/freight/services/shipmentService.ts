
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
    
    // Validate required fields
    if (!shipmentData.customer) {
      throw new Error('Customer is required');
    }
    
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

/**
 * Update an existing shipment in Firestore
 */
export const updateShipment = async (id: string, shipmentData: Partial<Omit<Shipment, 'id' | 'createdAt'>>): Promise<void> => {
  try {
    const shipmentRef = doc(db, COLLECTIONS.FREIGHT.SHIPMENTS, id);
    
    // Prepare data updates with timestamps if dates are provided
    const updates: any = { ...shipmentData };
    
    if (shipmentData.scheduledDate) {
      updates.scheduledDate = Timestamp.fromDate(new Date(shipmentData.scheduledDate));
    }
    
    if (shipmentData.estimatedDeliveryDate) {
      updates.estimatedDeliveryDate = Timestamp.fromDate(new Date(shipmentData.estimatedDeliveryDate));
    }
    
    if (shipmentData.actualDeliveryDate) {
      updates.actualDeliveryDate = Timestamp.fromDate(new Date(shipmentData.actualDeliveryDate));
    }
    
    await updateDoc(shipmentRef, updates);
    toast.success('Expédition mise à jour avec succès');
  } catch (error) {
    console.error('Error updating shipment:', error);
    toast.error('Erreur lors de la mise à jour de l\'expédition');
    throw error;
  }
};

/**
 * Delete a shipment from Firestore
 */
export const deleteShipment = async (id: string): Promise<void> => {
  try {
    const shipmentRef = doc(db, COLLECTIONS.FREIGHT.SHIPMENTS, id);
    await deleteDoc(shipmentRef);
    toast.success('Expédition supprimée avec succès');
  } catch (error) {
    console.error('Error deleting shipment:', error);
    toast.error('Erreur lors de la suppression de l\'expédition');
    throw error;
  }
};

/**
 * Get shipments by customer ID
 */
export const getShipmentsByCustomer = async (customerId: string): Promise<Shipment[]> => {
  try {
    const shipmentsQuery = query(
      collection(db, COLLECTIONS.FREIGHT.SHIPMENTS), 
      where('customer', '==', customerId)
    );
    
    const querySnapshot = await getDocs(shipmentsQuery);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        scheduledDate: data.scheduledDate?.toDate().toISOString() || new Date().toISOString(),
        estimatedDeliveryDate: data.estimatedDeliveryDate?.toDate().toISOString() || new Date().toISOString(),
        actualDeliveryDate: data.actualDeliveryDate?.toDate().toISOString() || undefined,
      } as Shipment;
    });
  } catch (error) {
    console.error('Error getting shipments by customer:', error);
    throw error;
  }
};
