
import { useState, useEffect } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Company } from '@/components/module/submodules/companies/types';
import { toast } from 'sonner';
import { isNetworkError } from './firestore/network-handler';

/**
 * Hook pour récupérer les entreprises depuis Firebase
 */
export const useFirebaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setIsLoading(true);
        const companiesCollection = collection(db, 'companies');
        const q = query(companiesCollection);
        const querySnapshot = await getDocs(q);
        
        const companiesData = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as Company[];
        
        setCompanies(companiesData);
        setIsLoading(false);
      } catch (err: any) {
        console.error('Erreur lors du chargement des entreprises:', err);
        
        if (isNetworkError(err)) {
          toast.error('Impossible de charger les entreprises: Mode hors ligne');
        } else {
          toast.error(`Erreur lors du chargement des entreprises: ${err.message}`);
        }
        
        setError(err instanceof Error ? err : new Error('Erreur inconnue'));
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  return { companies, isLoading, error };
};
