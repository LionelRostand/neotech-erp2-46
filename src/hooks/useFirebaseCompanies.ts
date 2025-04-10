
import { useState, useEffect } from 'react';
import { collection, getDocs, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company } from '@/components/module/submodules/companies/types';
import { toast } from 'sonner';
import { isNetworkError } from './firestore/network-handler';
import { COLLECTIONS } from '@/lib/firebase-collections';

/**
 * Hook pour récupérer les entreprises depuis Firebase avec mise à jour en temps réel
 */
export const useFirebaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    
    try {
      // Utiliser onSnapshot pour obtenir des mises à jour en temps réel
      const companiesCollection = collection(db, COLLECTIONS.COMPANIES);
      const q = query(companiesCollection);
      
      const unsubscribe = onSnapshot(q, 
        (querySnapshot) => {
          const companiesData = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          })) as Company[];
          
          setCompanies(companiesData);
          setIsLoading(false);
        },
        (err) => {
          console.error('Erreur lors du chargement des entreprises:', err);
          
          if (isNetworkError(err)) {
            toast.error('Impossible de charger les entreprises: Mode hors ligne');
          } else {
            toast.error(`Erreur lors du chargement des entreprises: ${err.message}`);
          }
          
          setError(err instanceof Error ? err : new Error('Erreur inconnue'));
          setIsLoading(false);
          
          // En cas d'erreur, essayer de charger les données une seule fois
          fetchCompaniesOnce();
        }
      );
      
      // Nettoyage lors du démontage du composant
      return () => unsubscribe();
    } catch (err: any) {
      console.error('Erreur lors de la configuration du listener:', err);
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      setIsLoading(false);
      
      // En cas d'erreur, essayer de charger les données une seule fois
      fetchCompaniesOnce();
    }
  }, []);
  
  // Fonction pour charger les données une seule fois en cas d'échec du listener
  const fetchCompaniesOnce = async () => {
    try {
      const companiesCollection = collection(db, COLLECTIONS.COMPANIES);
      const q = query(companiesCollection);
      const querySnapshot = await getDocs(q);
      
      const companiesData = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      })) as Company[];
      
      setCompanies(companiesData);
    } catch (err) {
      console.error('Échec également de la récupération unique:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { companies, isLoading, error };
};
