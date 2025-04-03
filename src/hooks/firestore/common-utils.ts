
import { db } from '@/lib/firebase';
import { doc, DocumentReference, collection, CollectionReference, Timestamp, DocumentData } from 'firebase/firestore';

/**
 * Obtient une référence à un document dans Firestore
 * @param collectionName Nom de la collection
 * @param docId ID du document
 * @returns Référence DocumentReference
 */
export const getDocRef = (collectionName: string, docId: string): DocumentReference => {
  return doc(db, collectionName, docId);
};

/**
 * Obtient une référence à une collection dans Firestore
 * @param collectionName Nom de la collection
 * @returns Référence CollectionReference
 */
export const getCollectionRef = (collectionName: string): CollectionReference => {
  return collection(db, collectionName);
};

// Fonction pour générer un ID unique pour les documents
export const generateDocId = (): string => {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Ajoute des horodatages (createdAt, updatedAt) aux documents
 * @param data Données du document
 * @returns Données avec les horodatages ajoutés
 */
export const formatDocumentWithTimestamps = (data: DocumentData): DocumentData => {
  const now = Timestamp.now();
  
  return {
    ...data,
    updatedAt: now,
    // Ajouter createdAt seulement s'il n'existe pas déjà
    ...(data.createdAt ? {} : { createdAt: now })
  };
};
