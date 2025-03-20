
import { useState } from 'react';
import { 
  DocumentData,
  QueryConstraint
} from 'firebase/firestore';
import { getAllDocuments, getDocumentById } from './firestore/read-operations';
import { addDocument } from './firestore/create-operations';
import { updateDocument, setDocument } from './firestore/update-operations';
import { deleteDocument } from './firestore/delete-operations';
import { handleNetworkError, enableFirestoreNetwork } from './firestore/network-handler';

// Hook for Firestore CRUD operations
export const useFirestore = (collectionName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline'>('online');
  
  // Reconnect to Firestore
  const reconnectToFirestore = async () => {
    const reconnected = await enableFirestoreNetwork();
    if (reconnected) {
      setNetworkStatus('online');
    }
    return reconnected;
  };
  
  // Get all documents from a collection
  const getAll = async (constraints?: QueryConstraint[]) => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching all documents from collection: ${collectionName}`);
      const data = await getAllDocuments(collectionName, constraints);
      console.log(`Retrieved ${data.length} documents from ${collectionName}`);
      setLoading(false);
      return data;
    } catch (err: any) {
      console.error(`Error getting all documents from ${collectionName}:`, err);
      setError(err.message || "Erreur lors de la récupération des données");
      setLoading(false);
      // Return empty array instead of throwing to prevent component crashes
      return [];
    }
  };
  
  // Get a document by ID
  const getById = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getDocumentById(collectionName, id);
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };
  
  // Add a new document
  const add = async (data: DocumentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await addDocument(collectionName, data);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Update a document
  const update = async (id: string, data: DocumentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateDocument(collectionName, id, data);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Delete a document
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteDocument(collectionName, id);
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Set a document with ID
  const set = async (id: string, data: DocumentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await setDocument(collectionName, id, data);
      setLoading(false);
      return result;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  };
  
  return {
    loading,
    error,
    networkStatus,
    getAll,
    getById,
    add,
    update,
    remove,
    set,
    reconnectToFirestore
  };
};
