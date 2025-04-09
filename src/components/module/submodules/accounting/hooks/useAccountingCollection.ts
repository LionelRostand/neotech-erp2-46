
import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, QueryConstraint, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

type AccountingCollectionKey = keyof typeof COLLECTIONS.ACCOUNTING;

/**
 * Hook pour récupérer les données d'une collection Accounting
 * @param collectionKey Nom de la collection dans COLLECTIONS.ACCOUNTING
 * @param queryConstraints Contraintes optionnelles pour la requête
 */
export const useAccountingCollection = (
  collectionKey: AccountingCollectionKey,
  queryConstraints: QueryConstraint[] = []
) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const collectionPath = COLLECTIONS.ACCOUNTING[collectionKey];
    console.log(`Fetching data from accounting collection: ${collectionPath}`);
    
    setIsLoading(true);
    
    try {
      // Créer une référence à la collection
      const collectionRef = collection(db, collectionPath);
      
      // Créer une requête avec les contraintes fournies
      const q = query(collectionRef, ...queryConstraints);
      
      // Configurer un écouteur en temps réel
      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const documents = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setData(documents);
          setIsLoading(false);
          console.log(`Received ${documents.length} documents from ${collectionPath}`);
        },
        (err: Error) => {
          console.error(`Error fetching from ${collectionPath}:`, err);
          setError(err);
          setIsLoading(false);
          toast.error(`Erreur lors du chargement des données: ${err.message}`);
        }
      );
      
      // Nettoyer l'abonnement lors du démontage
      return () => {
        console.log(`Unsubscribing from collection: ${collectionPath}`);
        unsubscribe();
      };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      console.error(`Error setting up listener for ${collectionKey}:`, error);
      setError(error);
      setIsLoading(false);
      toast.error(`Erreur lors de la configuration: ${error.message}`);
    }
  }, [collectionKey, JSON.stringify(queryConstraints)]);

  return { data, isLoading, error };
};

// Hooks spécifiques pour chaque collection
export const useInvoicesCollection = (queryConstraints: QueryConstraint[] = []) => {
  return useAccountingCollection('INVOICES', queryConstraints);
};

export const usePaymentsCollection = (queryConstraints: QueryConstraint[] = []) => {
  return useAccountingCollection('PAYMENTS', queryConstraints);
};

export const useExpensesCollection = (queryConstraints: QueryConstraint[] = []) => {
  return useAccountingCollection('EXPENSES', queryConstraints);
};

export const useClientsCollection = (queryConstraints: QueryConstraint[] = []) => {
  return useAccountingCollection('CLIENTS', queryConstraints);
};

export const useSuppliersCollection = (queryConstraints: QueryConstraint[] = []) => {
  return useAccountingCollection('SUPPLIERS', queryConstraints);
};

export const useReportsCollection = (queryConstraints: QueryConstraint[] = []) => {
  return useAccountingCollection('REPORTS', queryConstraints);
};

export const useTaxesCollection = (queryConstraints: QueryConstraint[] = []) => {
  return useAccountingCollection('TAXES', queryConstraints);
};

export const useTransactionsCollection = (queryConstraints: QueryConstraint[] = []) => {
  return useAccountingCollection('TRANSACTIONS', queryConstraints);
};

export const useAccountingSettingsCollection = (queryConstraints: QueryConstraint[] = []) => {
  return useAccountingCollection('SETTINGS', queryConstraints);
};

export const useAccountingPermissionsCollection = (queryConstraints: QueryConstraint[] = []) => {
  return useAccountingCollection('PERMISSIONS', queryConstraints);
};
