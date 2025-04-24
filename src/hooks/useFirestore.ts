
import { useState, useCallback } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  getDoc, 
  serverTimestamp, 
  DocumentData
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const useFirestore = (collectionPath: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Validate collection path
  const validatePath = useCallback(() => {
    if (!collectionPath || typeof collectionPath !== 'string' || collectionPath.trim() === '') {
      const err = new Error(`Invalid collection path: ${collectionPath}`);
      setError(err);
      console.error(err);
      return false;
    }
    return true;
  }, [collectionPath]);
  
  // Add a document
  const add = useCallback(async (data: any) => {
    if (!validatePath()) return null;
    
    setLoading(true);
    setError(null);
    try {
      const collectionRef = collection(db, collectionPath);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: data.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`Document added with ID: ${docRef.id}`);
      return { ...data, id: docRef.id };
    } catch (err: any) {
      setError(err);
      console.error(`Error adding document to ${collectionPath}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionPath, validatePath]);

  // Add a document with a specific ID
  const set = useCallback(async (id: string, data: any) => {
    if (!validatePath()) return null;
    
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionPath, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      console.log(`Document set with ID: ${id}`);
      return { ...data, id };
    } catch (err: any) {
      setError(err);
      console.error(`Error setting document in ${collectionPath}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionPath, validatePath]);

  // Update a document
  const update = useCallback(async (id: string, data: any) => {
    if (!validatePath()) return null;
    
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionPath, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      console.log(`Document updated with ID: ${id}`);
      return { ...data, id };
    } catch (err: any) {
      setError(err);
      console.error(`Error updating document in ${collectionPath}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionPath, validatePath]);

  // Delete a document
  const remove = useCallback(async (id: string) => {
    if (!validatePath()) return false;
    
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionPath, id);
      await deleteDoc(docRef);
      console.log(`Document deleted with ID: ${id}`);
      return true;
    } catch (err: any) {
      setError(err);
      console.error(`Error deleting document in ${collectionPath}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionPath, validatePath]);

  // Get a document by ID
  const getById = useCallback(async (id: string) => {
    if (!validatePath()) return null;
    
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, collectionPath, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { ...docSnap.data(), id: docSnap.id };
        return data;
      } else {
        console.log(`No document found with ID: ${id}`);
        return null;
      }
    } catch (err: any) {
      setError(err);
      console.error(`Error getting document from ${collectionPath}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionPath, validatePath]);

  // Get all documents from the collection
  const getAll = useCallback(async () => {
    if (!validatePath()) return [];
    
    setLoading(true);
    setError(null);
    try {
      const collectionRef = collection(db, collectionPath);
      const snapshot = await getDocs(collectionRef);
      
      const docs = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      
      console.log(`Retrieved ${docs.length} documents from ${collectionPath}`);
      return docs;
    } catch (err: any) {
      setError(err);
      console.error(`Error getting documents from ${collectionPath}:`, err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [collectionPath, validatePath]);

  return {
    add,
    set,
    update,
    remove,
    getById,
    getAll,
    loading,
    error
  };
};
