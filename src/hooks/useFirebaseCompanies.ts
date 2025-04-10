
import { useState, useEffect } from 'react';
import { Company } from '@/components/module/submodules/companies/types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useCollectionData } from './useCollectionData';
import { toast } from 'sonner';
import { getAllCompanies } from '@/components/module/submodules/employees/services/companyService';

/**
 * Hook pour accéder aux données des entreprises depuis Firebase
 * avec gestion du cache et des états de chargement
 */
export const useFirebaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Utiliser useCollectionData pour obtenir les données en temps réel
  const { 
    data: firestoreCompanies, 
    isLoading: isFirestoreLoading, 
    error: firestoreError,
    isOffline
  } = useCollectionData(COLLECTIONS.COMPANIES);
  
  // Fonction pour rafraîchir manuellement les données
  const refetch = async () => {
    setIsLoading(true);
    try {
      const freshCompanies = await getAllCompanies();
      if (Array.isArray(freshCompanies) && freshCompanies.length > 0) {
        setCompanies(freshCompanies as Company[]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des entreprises:", err);
      setError(err instanceof Error ? err : new Error("Erreur inconnue"));
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mettre à jour les entreprises lorsque les données Firestore changent
  useEffect(() => {
    if (!isFirestoreLoading && Array.isArray(firestoreCompanies)) {
      console.log(`${firestoreCompanies.length} entreprises récupérées depuis Firestore`);
      setCompanies(firestoreCompanies as Company[]);
      setIsLoading(false);
    }
    
    if (firestoreError) {
      console.error("Erreur lors de la récupération des entreprises:", firestoreError);
      setError(firestoreError);
      setIsLoading(false);
      
      // En cas d'erreur, tenter de récupérer les données directement sans le listener
      if (!companies.length) {
        console.log("Tentative de récupération directe des entreprises...");
        getAllCompanies()
          .then(data => {
            if (Array.isArray(data) && data.length > 0) {
              setCompanies(data as Company[]);
              console.log(`${data.length} entreprises récupérées directement`);
            }
          })
          .catch(err => console.error("Échec de la récupération directe:", err));
      }
    }
  }, [firestoreCompanies, isFirestoreLoading, firestoreError]);
  
  return {
    companies,
    isLoading: isLoading || isFirestoreLoading,
    error: error || firestoreError,
    refetch,
    isOffline
  };
};
