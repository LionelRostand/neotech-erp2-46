
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
    
    const documentData = {
      ...document,
      module: 'freight',
      category: 'shipping_documents',
      status: 'active',
      section: 'freight_documents',
      documentType: document.type,
      fileUrl: document.url,
      fileName: document.name,
      metadata: {
        documentCategory: document.type === 'delivery_note' ? 'shipping' : 'invoice',
        reference: document.reference || '',
        archiveStatus: 'active',
        visibility: 'visible',
        sourceModule: 'freight',
        subModule: 'shipping_docs',
        creationContext: 'payment_confirmation'
      },
      createdBy: 'system',
      createdAt: document.createdAt,
      lastModified: new Date().toISOString()
    };
    
    console.log('Saving document with data:', documentData);
    
    const docRef = await addDoc(collection(db, COLLECTIONS.FREIGHT.DOCUMENTS), documentData);
    console.log('Document saved successfully with ID:', docRef.id);
    
    return docRef.id;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
};
