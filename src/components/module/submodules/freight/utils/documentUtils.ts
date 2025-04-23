
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

// Function to save a document to the documents collection
export const saveDocumentToModule = async (documentData: {
  name: string;
  type: string;
  url: string;
  reference: string | undefined;
  createdAt: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.FREIGHT.DOCUMENTS), {
      ...documentData,
      updatedAt: new Date().toISOString(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
};
