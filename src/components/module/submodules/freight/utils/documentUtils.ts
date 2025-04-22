
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
    const docRef = await addDoc(collection(db, COLLECTIONS.FREIGHT.DOCUMENTS), {
      ...document,
      module: 'freight',
      category: document.type === 'delivery_note' ? 'delivery_note' : 'invoice',
      status: 'active',
      shipment: document.reference,
      creator: 'Système',
      section: 'freight_documents',
      documentType: 'invoice',
      metadata: {
        documentCategory: 'billing',
        invoiceReference: document.reference
      }
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving document to module:', error);
    throw error;
  }
};
