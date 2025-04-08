
import { useEffect } from 'react';
import { Timestamp, DocumentData, serverTimestamp, collection, query, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Prospect } from '../../types/crm-types';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useProspectData = (
  setProspects: React.Dispatch<React.SetStateAction<Prospect[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  useEffect(() => {
    loadProspects();
  }, []);

  const loadProspects = async () => {
    try {
      setLoading(true);
      const prospectCollection = collection(db, COLLECTIONS.CRM.PROSPECTS);
      const q = query(prospectCollection, orderBy('createdAt', 'desc'));
      
      const querySnapshot = await getDocs(q);
      
      // Si la collection est vide, ajouter des données de démonstration
      if (querySnapshot.empty) {
        console.log('Aucun prospect trouvé, ajout de données de démonstration');
        await seedMockProspects();
        // Récupérer à nouveau après l'ajout des données de démo
        loadProspects();
        return;
      }
      
      const data = querySnapshot.docs;
      
      const formattedData = data.map((doc: DocumentData) => {
        const createdAtTimestamp = doc.data().createdAt;
        
        let createdAtDate = '';
        
        // Gestion sécurisée de la date createdAt
        if (createdAtTimestamp) {
          if (createdAtTimestamp instanceof Timestamp) {
            createdAtDate = createdAtTimestamp.toDate().toISOString().split('T')[0];
          } else if (createdAtTimestamp instanceof Date) {
            createdAtDate = createdAtTimestamp.toISOString().split('T')[0];
          } else if (typeof createdAtTimestamp === 'string') {
            createdAtDate = new Date(createdAtTimestamp).toISOString().split('T')[0];
          }
        } else {
          createdAtDate = new Date().toISOString().split('T')[0];
        }
        
        return {
          id: doc.id,
          company: doc.data().company || '',
          contactName: doc.data().contactName || '',
          contactEmail: doc.data().contactEmail || '',
          contactPhone: doc.data().contactPhone || '',
          status: doc.data().status || 'new',
          source: doc.data().source || '',
          createdAt: createdAtDate,
          notes: doc.data().notes || '',
          industry: doc.data().industry || '',
          website: doc.data().website || '',
          address: doc.data().address || '',
          size: doc.data().size || '',
          estimatedValue: doc.data().estimatedValue || '',
        } as Prospect;
      });
      
      setProspects(formattedData);
    } catch (error) {
      console.error("Erreur lors du chargement des prospects:", error);
      toast.error("Impossible de charger les prospects");
    } finally {
      setLoading(false);
    }
  };

  // Seed mock data if collection is empty
  const seedMockProspects = async () => {
    try {
      const prospectCollection = collection(db, COLLECTIONS.CRM.PROSPECTS);
      
      const mockProspects = [
        {
          company: 'Tech Innovations',
          contactName: 'Pierre Dupont',
          contactEmail: 'pierre@techinnovations.fr',
          contactPhone: '01 23 45 67 89',
          status: 'new',
          source: 'website',
          industry: 'technology',
          website: 'www.techinnovations.fr',
          address: '123 Boulevard de l\'Innovation, Paris',
          size: 'medium',
          estimatedValue: 25000,
          notes: 'Prospect intéressé par notre solution CRM',
          createdAt: serverTimestamp()
        },
        {
          company: 'Green Solutions',
          contactName: 'Marie Lambert',
          contactEmail: 'marie@greensolutions.fr',
          contactPhone: '01 98 76 54 32',
          status: 'contacted',
          source: 'linkedin',
          industry: 'environmental',
          website: 'www.greensolutions.fr',
          address: '456 Rue de l\'Écologie, Lyon',
          size: 'small',
          estimatedValue: 15000,
          notes: 'Premier contact effectué, en attente de retour',
          createdAt: serverTimestamp()
        },
        {
          company: 'Global Finance',
          contactName: 'Julien Martin',
          contactEmail: 'julien@globalfinance.fr',
          contactPhone: '01 45 67 89 01',
          status: 'meeting',
          source: 'referral',
          industry: 'finance',
          website: 'www.globalfinance.fr',
          address: '789 Avenue des Finances, Bordeaux',
          size: 'large',
          estimatedValue: 50000,
          notes: 'Rendez-vous programmé pour la semaine prochaine',
          createdAt: serverTimestamp()
        }
      ];
      
      const promises = mockProspects.map(prospect => 
        addDoc(prospectCollection, prospect)
      );
      
      await Promise.all(promises);
      console.log('Données de démonstration des prospects ajoutées avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout des données de démonstration:', error);
    }
  };

  return { loadProspects };
};
