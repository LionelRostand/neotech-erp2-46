
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const saveDocumentToModule = async (document: {
  name: string;
  type: string;
  url: string;
  reference?: string;
  createdAt: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.DOCUMENTS.FILES), {
      ...document,
      module: 'freight',
      category: 'invoice',
      status: 'active'
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving document to module:', error);
    throw error;
  }
};
