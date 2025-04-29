
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company } from '@/components/module/submodules/companies/types';
import { COLLECTIONS } from '@/lib/firebase-collections';

/**
 * Hook pour récupérer les entreprises depuis Firestore
 */
export const useFirebaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const companiesRef = collection(db, COLLECTIONS.COMPANIES);
        const q = query(companiesRef, orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedCompanies = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || 'Entreprise sans nom',
          ...doc.data()
        })) as Company[];
        
        setCompanies(fetchedCompanies);
      } catch (err) {
        console.error("Erreur lors de la récupération des entreprises:", err);
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, isLoading, error };
};
