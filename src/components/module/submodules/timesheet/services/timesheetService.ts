
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { TimeReport } from '@/types/timesheet';

/**
 * Ajouter une nouvelle feuille de temps
 */
export const addTimeSheet = async (timeSheetData: any): Promise<boolean> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.HR.TIMESHEET), timeSheetData);
    return !!docRef.id;
  } catch (error) {
    console.error("Erreur lors de l'ajout d'une feuille de temps:", error);
    throw error;
  }
};

/**
 * Récupérer toutes les feuilles de temps
 */
export const getAllTimeSheets = async (): Promise<TimeReport[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.HR.TIMESHEET));
    const timeSheets = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as TimeReport));
    return timeSheets;
  } catch (error) {
    console.error("Erreur lors de la récupération des feuilles de temps:", error);
    throw error;
  }
};

/**
 * Mettre à jour une feuille de temps
 */
export const updateTimeSheet = async (id: string, data: Partial<TimeReport>): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.TIMESHEET, id);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error("Erreur lors de la mise à jour d'une feuille de temps:", error);
    throw error;
  }
};

/**
 * Supprimer une feuille de temps
 */
export const deleteTimeSheet = async (id: string): Promise<boolean> => {
  try {
    const docRef = doc(db, COLLECTIONS.HR.TIMESHEET, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression d'une feuille de temps:", error);
    throw error;
  }
};
