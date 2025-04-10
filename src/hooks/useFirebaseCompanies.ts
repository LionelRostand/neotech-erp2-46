
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
  
  // Utiliser useCollectionData pour obtenir les données en temps réel avec gestion des erreurs de permission
  const { 
    data: firestoreCompanies, 
    isLoading: isFirestoreLoading, 
    error: firestoreError,
    isOffline
  } = useCollectionData(
    COLLECTIONS.COMPANIES, 
    [], 
    { 
      // Add mock data for development when permissions fail
      fallbackData: [
        {
          id: 'mock-company-1',
          name: 'Enterprise Solutions (Demo)',
          industry: 'Technology',
          status: 'active',
          website: 'www.enterprise-solutions.example',
          phone: '+33 1 23 45 67 89',
          email: 'contact@enterprise-solutions.example',
          employeesCount: 45,
          createdAt: new Date(),
          updatedAt: new Date(),
          address: {
            street: '123 Business Avenue',
            city: 'Paris',
            zip: '75001',
            country: 'France'
          }
        },
        {
          id: 'mock-company-2',
          name: 'TechInnovation (Demo)',
          industry: 'IT Services',
          status: 'active',
          website: 'www.techinnovation.example',
          phone: '+33 9 87 65 43 21',
          email: 'info@techinnovation.example',
          employeesCount: 24,
          createdAt: new Date(),
          updatedAt: new Date(),
          address: {
            street: '456 Tech Park',
            city: 'Lyon',
            zip: '69001',
            country: 'France'
          }
        }
      ]
    }
  );
  
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
