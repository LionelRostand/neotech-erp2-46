
import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company } from '@/components/module/submodules/companies/types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

/**
 * Hook pour récupérer les données des entreprises depuis Firebase
 */
export const useFirebaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    setIsLoading(true);
    
    try {
      console.log('Récupération des entreprises depuis Firestore...');
      const companiesRef = collection(db, COLLECTIONS.COMPANIES);
      const q = query(companiesRef, orderBy('name', 'asc'));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const companiesData: Company[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || 'Entreprise sans nom',
            industry: data.industry || '',
            status: data.status || 'active',
            website: data.website || '',
            phone: data.phone || '',
            email: data.email || '',
            employeesCount: data.employeesCount || 0,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            address: data.address || {
              street: '',
              city: '',
              postalCode: '',
              country: ''
            }
          } as Company;
        });
        
        console.log(`${companiesData.length} entreprises récupérées`);
        setCompanies(companiesData);
        setIsLoading(false);
      }, (err) => {
        console.error("Erreur lors de la récupération des entreprises:", err);
        setError(err);
        setIsLoading(false);
        
        // En cas d'erreur, créer des données de démonstration
        const mockCompanies = [
          {
            id: 'enterprise1',
            name: 'Enterprise Solutions (Demo)',
            industry: 'Technologie',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            address: {
              street: '123 Rue de la Tech',
              city: 'Paris',
              postalCode: '75001',
              country: 'France'
            }
          },
          {
            id: 'techinno',
            name: 'TechInnovation (Demo)', 
            industry: 'IT Services',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            address: {
              street: '45 Avenue de l\'Innovation',
              city: 'Lyon',
              postalCode: '69001',
              country: 'France'
            }
          },
          {
            id: 'greenco',
            name: 'GreenCo (Demo)',
            industry: 'Environnement',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            address: {
              street: '78 Boulevard Vert',
              city: 'Bordeaux',
              postalCode: '33000',
              country: 'France'
            }
          }
        ] as Company[];
        
        setCompanies(mockCompanies);
        toast.error("Impossible de récupérer les entreprises depuis Firestore. Des données de démonstration sont utilisées.");
      });
      
      return unsubscribe;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      console.error("Erreur lors de l'initialisation du listener des entreprises:", error);
      setError(error);
      setIsLoading(false);
      
      return () => {};
    }
  }, []);

  return {
    companies,
    isLoading,
    error
  };
};
