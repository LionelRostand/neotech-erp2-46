
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

export const useFirebaseCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  useEffect(() => {
    // Gérer les changements de connectivité
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    setIsLoading(true);
    
    try {
      console.log('Récupération des entreprises depuis Firestore...');
      
      // Vérifier les données en cache avant de charger de nouvelles données
      const cachedCompanies = localStorage.getItem('cached_companies');
      if (cachedCompanies && isOffline) {
        const parsedCompanies = JSON.parse(cachedCompanies);
        setCompanies(parsedCompanies);
        setIsLoading(false);
        toast.warning("Données chargées depuis le cache en mode hors-ligne");
        return;
      }
      
      // Utiliser directement 'companies' comme chemin de collection
      const companiesCollectionPath = 'companies';
      
      if (!companiesCollectionPath) {
        throw new Error('Le chemin de la collection des entreprises n\'est pas défini');
      }
      
      const companiesRef = collection(db, companiesCollectionPath);
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
        
        // Mettre à jour le cache local
        localStorage.setItem('cached_companies', JSON.stringify(companiesData));
        
        setIsLoading(false);
        setIsOffline(false);
      }, (err) => {
        console.error("Erreur lors de la récupération des entreprises:", err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
        setIsOffline(true);
        
        // Vérifier les données en cache
        const cachedCompanies = localStorage.getItem('cached_companies');
        if (cachedCompanies) {
          const parsedCompanies = JSON.parse(cachedCompanies);
          setCompanies(parsedCompanies);
          toast.warning("Utilisation des données en cache en raison d'un problème de connexion");
        } else {
          // Données de démonstration si aucun cache n'est disponible
          const mockCompanies: Company[] = [
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
            // ... autres entreprises de démonstration
          ];
          
          setCompanies(mockCompanies);
          toast.error("Impossible de récupérer les entreprises. Des données de démonstration sont utilisées.");
        }
      });
      
      return unsubscribe;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
      console.error("Erreur lors de l'initialisation du listener des entreprises:", error);
      setError(error);
      setIsLoading(false);
      setIsOffline(true);
      
      return () => {};
    }
  }, []);

  const refetch = async () => {
    setIsLoading(true);
    try {
      // Utiliser directement 'companies' comme chemin de collection
      const companiesRef = collection(db, 'companies');
      const q = query(companiesRef, orderBy('name', 'asc'));
      
      console.log("Actualisation des données des entreprises...");
      
      return true;
    } catch (error) {
      console.error("Erreur lors de l'actualisation des entreprises:", error);
      toast.error("Erreur lors de l'actualisation des entreprises");
      setIsLoading(false);
      return false;
    }
  };

  return {
    companies,
    isLoading,
    error,
    isOffline,
    refetch
  };
};
