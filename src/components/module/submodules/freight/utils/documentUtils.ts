
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
    
    // Structure du document avec toutes les métadonnées requises
    const documentData = {
      ...document,
      module: 'freight',
      category: 'freight_documents',
      status: 'active',
      section: 'shipping_docs',
      documentType: document.type,
      fileUrl: document.url,
      fileName: document.name,
      metadata: {
        documentCategory: document.type === 'delivery_note' ? 'shipping' : 'billing',
        reference: document.reference,
        archiveStatus: 'active',
        visibility: 'visible',
        sourceModule: 'freight',
        subModule: 'invoices'
      },
      // Informations de traçabilité
      createdBy: 'system',
      createdAt: document.createdAt,
      lastModified: new Date().toISOString(),
    };
    
    console.log('Attempting to save document with data:', documentData);
    
    // Sauvegarder dans la collection freight_documents
    const docRef = await addDoc(collection(db, COLLECTIONS.FREIGHT.DOCUMENTS), documentData);
    console.log('Document saved successfully with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving document to module:', error);
    throw error;
  }
};
