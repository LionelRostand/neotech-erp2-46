
import { useState, useEffect } from 'react';
import { Company } from '@/components/module/submodules/companies/types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useCollectionData } from './useCollectionData';
import { toast } from 'sonner';
import { getAllCompanies } from '@/components/module/submodules/employees/services/companyService';
import { useAuth } from './useAuth';

/**
 * Hook pour accéder aux données des entreprises depuis Firebase
 * avec gestion du cache et des états de chargement
 */
export const useFirebaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { isOffline } = useAuth(); // Get isOffline from useAuth
  
  // Utiliser useCollectionData pour obtenir les données en temps réel avec gestion des erreurs de permission
  const { 
    data: firestoreCompanies, 
    isLoading: isFirestoreLoading, 
    error: firestoreError
  } = useCollectionData(
    COLLECTIONS.COMPANIES, 
    []
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
      
      // Si aucune donnée n'est récupérée ou qu'une erreur se produit,
      // utiliser des données de démonstration pour le développement
      if (import.meta.env.DEV) {
        console.log("Aucune donnée réelle n'a été récupérée, utilisation des données de démonstration");
        setCompanies([
          {
            id: 'mock-company-1',
            name: 'Enterprise Solutions (Demo)',
            industry: 'Technology',
            status: 'active',
            website: 'www.enterprise-solutions.example',
            phone: '+33 1 23 45 67 89',
            email: 'contact@enterprise-solutions.example',
            employeesCount: 45,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            address: {
              street: '123 Business Avenue',
              city: 'Paris',
              postalCode: '75001',
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            address: {
              street: '456 Tech Park',
              city: 'Lyon',
              postalCode: '69001',
              country: 'France'
            }
          }
        ]);
        return true;
      }

      return false;
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des entreprises:", err);
      setError(err instanceof Error ? err : new Error("Erreur inconnue"));
      
      // Utiliser des données de démonstration en cas d'erreur en développement
      if (import.meta.env.DEV) {
        console.log("Erreur lors de la récupération des données, utilisation des données de démonstration");
        setCompanies([
          {
            id: 'mock-company-1',
            name: 'Enterprise Solutions (Demo)',
            industry: 'Technology',
            status: 'active',
            website: 'www.enterprise-solutions.example',
            phone: '+33 1 23 45 67 89',
            email: 'contact@enterprise-solutions.example',
            employeesCount: 45,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            address: {
              street: '123 Business Avenue',
              city: 'Paris',
              postalCode: '75001',
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            address: {
              street: '456 Tech Park',
              city: 'Lyon',
              postalCode: '69001',
              country: 'France'
            }
          }
        ]);
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mettre à jour les entreprises lorsque les données Firestore changent
  useEffect(() => {
    if (!isFirestoreLoading) {
      if (Array.isArray(firestoreCompanies) && firestoreCompanies.length > 0) {
        console.log(`${firestoreCompanies.length} entreprises récupérées depuis Firestore`);
        setCompanies(firestoreCompanies as Company[]);
        setIsLoading(false);
      } else if (firestoreError) {
        console.error("Erreur lors de la récupération des entreprises:", firestoreError);
        setError(firestoreError);
        
        // En cas d'erreur de permission, essayer de récupérer les données manuellement
        if (firestoreError.message.includes('permission-denied') || firestoreError.message.includes('permission')) {
          console.log("Erreur de permission détectée, tentative de récupération manuelle des données");
          refetch();
        } else {
          setIsLoading(false);
        }
      } else {
        // Si aucune donnée n'est récupérée, essayer de récupérer les données manuellement
        console.log("Aucune entreprise récupérée depuis Firestore, tentative de récupération manuelle");
        refetch();
      }
    }
  }, [firestoreCompanies, isFirestoreLoading, firestoreError]);
  
  return {
    companies,
    isLoading: isLoading || isFirestoreLoading,
    error: error || firestoreError,
    refetch,
    isOffline  // Pass isOffline from useAuth
  };
};
