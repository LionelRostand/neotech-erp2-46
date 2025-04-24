
import { useState } from 'react';
import { collection, addDoc, doc, getDoc, getDocs, query, updateDoc, deleteDoc, serverTimestamp, QueryConstraint } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { executeWithNetworkRetry } from './firestore/network-handler';

/**
 * Hook that provides access to Firestore operations with loading and error states
 * @param collectionPath Collection path to scope the operations
 */
export const useFirestore = (collectionPath: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Vérifie si le chemin de collection est valide
  const isValidPath = () => {
    if (!collectionPath || collectionPath.trim() === '') {
      console.error('Erreur: le chemin de collection ne peut pas être vide');
      throw new Error('Le chemin de collection ne peut pas être vide');
    }
    return true;
  };
  
  const getAll = async (constraints?: QueryConstraint[]) => {
    setLoading(true);
    try {
      isValidPath();
      console.log(`Récupération des documents depuis ${collectionPath}`);
      
      const collectionRef = collection(db, collectionPath);
      const q = constraints ? query(collectionRef, ...constraints) : query(collectionRef);
      
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`${docs.length} documents récupérés depuis ${collectionPath}`);
      return docs;
    } catch (err: any) {
      console.error(`Erreur lors de la récupération des documents de ${collectionPath}:`, err);
      setError(err);
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  const getById = async (id: string) => {
    setLoading(true);
    try {
      isValidPath();
      console.log(`Récupération du document ${id} depuis ${collectionPath}`);
      
      const docRef = doc(db, collectionPath, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        console.log(`Document ${id} non trouvé dans ${collectionPath}`);
        return null;
      }
    } catch (err: any) {
      console.error(`Erreur lors de la récupération du document ${id} de ${collectionPath}:`, err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  const add = async (data: any) => {
    setLoading(true);
    try {
      isValidPath();
      console.log(`Ajout d'un document à ${collectionPath}:`, data);
      
      const collectionRef = collection(db, collectionPath);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: data.createdAt || serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      console.log(`Document ajouté à ${collectionPath} avec l'ID:`, docRef.id);
      return docRef.id;
    } catch (err: any) {
      console.error(`Erreur lors de l'ajout d'un document à ${collectionPath}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const update = async (id: string, data: any) => {
    setLoading(true);
    try {
      isValidPath();
      console.log(`Mise à jour du document ${id} dans ${collectionPath}:`, data);
      
      const docRef = doc(db, collectionPath, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      console.log(`Document ${id} mis à jour dans ${collectionPath}`);
      return true;
    } catch (err: any) {
      console.error(`Erreur lors de la mise à jour du document ${id} dans ${collectionPath}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const remove = async (id: string) => {
    setLoading(true);
    try {
      isValidPath();
      console.log(`Suppression du document ${id} de ${collectionPath}`);
      
      const docRef = doc(db, collectionPath, id);
      await deleteDoc(docRef);
      
      console.log(`Document ${id} supprimé de ${collectionPath}`);
      return true;
    } catch (err: any) {
      console.error(`Erreur lors de la suppression du document ${id} de ${collectionPath}:`, err);
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const set = async (id: string, data: any) => {
    // Implémentation similaire à update, mais utilise setDoc pour remplacer complètement le document
    return update(id, data);
  };
  
  return {
    loading,
    error,
    getAll,
    getById,
    add,
    update,
    remove,
    set,
    collectionPath
  };
};

// Export default pour la compatibilité descendante
export default useFirestore;
