
import { useEffect, useState } from 'react';
import { 
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Hook pour les opérations CRUD Firestore
export const useFirestore = (collectionName: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Récupérer tous les documents d'une collection
  const getAll = async (constraints?: QueryConstraint[]) => {
    setLoading(true);
    setError(null);
    
    try {
      const collectionRef = collection(db, collectionName);
      const q = constraints ? query(collectionRef, ...constraints) : query(collectionRef);
      const querySnapshot = await getDocs(q);
      
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      
      setLoading(false);
      return data;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Récupérer un document par son ID
  const getById = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setLoading(false);
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        setLoading(false);
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Ajouter un nouveau document
  const add = async (data: DocumentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const collectionRef = collection(db, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      setLoading(false);
      return { id: docRef.id, ...data };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Mettre à jour un document existant
  const update = async (id: string, data: DocumentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
      
      setLoading(false);
      return { id, ...data };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Supprimer un document
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      
      setLoading(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  // Créer ou mettre à jour un document avec un ID spécifique
  const set = async (id: string, data: DocumentData) => {
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      }, { merge: true });
      
      setLoading(false);
      return { id, ...data };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };
  
  return {
    loading,
    error,
    getAll,
    getById,
    add,
    update,
    remove,
    set
  };
};
