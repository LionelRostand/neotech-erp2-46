
import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Shipment, ShipmentLine } from '@/types/freight';

export interface ShipmentPricing {
  basePrice: number;
  geoZone: string;
  shipmentKind: string;
  distance: number;
  extraFees: number;
}

export interface CreateShipmentData {
  reference: string;
  customer: string;
  origin: string;
  destination: string;
  totalWeight: number;
  shipmentType: 'import' | 'export' | 'local' | 'international';
  status: 'draft' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'delayed';
  lines: ShipmentLine[];
  trackingNumber?: string;
  createdAt?: string;
  scheduledDate: string;
  estimatedDeliveryDate: string;
  actualDeliveryDate?: string;
  carrier: string;
  carrierName: string;
  notes?: string;
  totalPrice?: number;
  pricing?: ShipmentPricing;
  routeId?: string;
  customerName?: string;
  // Permet de stocker toute donnée additionnelle reçue du wizard
  [key: string]: any;
}

/**
 * Create a new shipment in Firestore
 */
export const createShipment = async (shipmentData: CreateShipmentData): Promise<string> => {
  try {
    // Validation champs requis
    if (!shipmentData.origin || !shipmentData.origin.trim()) {
      throw new Error('Le champ origine est obligatoire');
    }
    if (!shipmentData.destination || !shipmentData.destination.trim()) {
      throw new Error('Le champ destination est obligatoire');
    }

    // Stocker TOUS les champs reçus, pour ne rien perdre du wizard
    const firebaseData = {
      ...shipmentData,
      createdAt: shipmentData.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const shipmentsRef = collection(db, COLLECTIONS.FREIGHT.SHIPMENTS);
    console.log('Envoi des données vers Firebase:', firebaseData);
    const docRef = await addDoc(shipmentsRef, firebaseData);

    console.log('Shipment created with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw error;
  }
};

export const updateShipment = async (shipmentId: string, shipmentData: Partial<Shipment>): Promise<void> => {
  try {
    const shipmentRef = doc(db, COLLECTIONS.FREIGHT.SHIPMENTS, shipmentId);
    await updateDoc(shipmentRef, {
      ...shipmentData,
      updatedAt: serverTimestamp()
    });
    console.log('Shipment updated:', shipmentId);
  } catch (error) {
    console.error('Error updating shipment:', error);
    throw error;
  }
};

export const deleteShipment = async (shipmentId: string): Promise<void> => {
  try {
    const shipmentRef = doc(db, COLLECTIONS.FREIGHT.SHIPMENTS, shipmentId);
    await deleteDoc(shipmentRef);
    console.log('Shipment deleted:', shipmentId);
  } catch (error) {
    console.error('Error deleting shipment:', error);
    throw error;
  }
};
