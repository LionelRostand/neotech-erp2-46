
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
    console.log('Saving document to Firestore:', document);
    console.log('Collection path:', COLLECTIONS.FREIGHT.DOCUMENTS);
    
    // Structurer les données du document avec les métadonnées nécessaires
    const documentData = {
      ...document,
      module: 'freight',
      category: document.type === 'delivery_note' ? 'delivery_note' : 'invoice',
      status: 'active',
      section: 'freight_documents',
      documentType: document.type === 'delivery_note' ? 'delivery_note' : 'invoice',
      metadata: {
        documentCategory: document.type === 'delivery_note' ? 'shipping' : 'billing',
        reference: document.reference,
        archiveStatus: 'active',
        visibility: 'visible'
      },
      // Ajouter des informations de traçabilité
      createdBy: 'system',
      createdAt: document.createdAt,
      lastModified: new Date().toISOString(),
    };
    
    // Sauvegarder dans la collection freight_documents
    const docRef = await addDoc(collection(db, COLLECTIONS.FREIGHT.DOCUMENTS), documentData);
    console.log('Document saved successfully with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving document to module:', error);
    throw error;
  }
};
