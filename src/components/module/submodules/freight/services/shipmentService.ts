
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Shipment } from '@/types/freight';

// Ajouter une expédition dans Firebase
export const createShipment = async (shipmentData: Omit<Shipment, 'id' | 'createdAt'>) => {
  try {
    // Préparer les données avec la date de création
    const newShipment = {
      ...shipmentData,
      createdAt: new Date().toISOString(),
    };
    
    // Utiliser la fonction addDocument pour ajouter à Firebase
    const result = await addDocument(COLLECTIONS.FREIGHT.SHIPMENTS, newShipment);
    return result;
  } catch (error) {
    console.error('Error creating shipment:', error);
    throw error;
  }
};

// Mettre à jour une expédition dans Firebase
export const updateShipment = async (id: string, shipmentData: Partial<Shipment>) => {
  try {
    // Utiliser le service de mise à jour de document de Firebase
    // Cette implémentation peut dépendre de la structure de votre application
    const docRef = `${COLLECTIONS.FREIGHT.SHIPMENTS}/${id}`;
    // Ici, vous devez implémenter la mise à jour du document selon votre logique Firebase
    // La mise à jour de l'expédition doit être implémentée selon votre structure de données
    
    return shipmentData;
  } catch (error) {
    console.error('Error updating shipment:', error);
    throw error;
  }
};

// Supprimer une expédition de Firebase
export const deleteShipment = async (id: string) => {
  try {
    // Utiliser le service de suppression de document de Firebase
    // Cette implémentation peut dépendre de la structure de votre application
    const docRef = `${COLLECTIONS.FREIGHT.SHIPMENTS}/${id}`;
    // Ici, vous devez implémenter la suppression du document selon votre logique Firebase
    
    return true;
  } catch (error) {
    console.error('Error deleting shipment:', error);
    throw error;
  }
};
