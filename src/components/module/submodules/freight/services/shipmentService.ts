
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

/**
 * Update an existing shipment
 */
export const updateShipment = async (shipmentId: string, shipmentData: Partial<Shipment>): Promise<void> => {
  try {
    // Use the freight_shipments collection path from COLLECTIONS
    const shipmentRef = doc(db, COLLECTIONS.FREIGHT.SHIPMENTS, shipmentId);
    
    // Convert dates to Firestore timestamps if present
    const dataToUpdate: any = { ...shipmentData };
    
    if (shipmentData.scheduledDate) {
      dataToUpdate.scheduledDate = Timestamp.fromDate(new Date(shipmentData.scheduledDate));
    }
    
    if (shipmentData.estimatedDeliveryDate) {
      dataToUpdate.estimatedDeliveryDate = Timestamp.fromDate(new Date(shipmentData.estimatedDeliveryDate));
    }
    
    if (shipmentData.actualDeliveryDate) {
      dataToUpdate.actualDeliveryDate = Timestamp.fromDate(new Date(shipmentData.actualDeliveryDate));
    }
    
    await updateDoc(shipmentRef, dataToUpdate);
    console.log('Shipment updated successfully:', shipmentId);
    toast.success('Expédition mise à jour avec succès');
  } catch (error) {
    console.error('Error updating shipment:', error);
    toast.error('Erreur lors de la mise à jour de l\'expédition');
    throw error;
  }
};

/**
 * Delete a shipment
 */
export const deleteShipment = async (shipmentId: string): Promise<void> => {
  try {
    const shipmentRef = doc(db, COLLECTIONS.FREIGHT.SHIPMENTS, shipmentId);
    await deleteDoc(shipmentRef);
    console.log('Shipment deleted successfully:', shipmentId);
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
    const shipmentsRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
    const q = query(shipmentsRef, where('customer', '==', customerId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Convert Firestore timestamps to ISO strings
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
        actualDeliveryDate
      } as Shipment;
    });
  } catch (error) {
    console.error('Error getting shipments by customer:', error);
    toast.error('Erreur lors de la récupération des expéditions');
    throw error;
  }
};
