
import { useState, useEffect, useCallback } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, Timestamp, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Opportunity, OpportunityFormData, OpportunityStage } from '../types/crm-types';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    try {
      const opportunitiesRef = collection(db, COLLECTIONS.CRM.OPPORTUNITIES);
      const q = query(opportunitiesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      // Si la collection est vide, ajouter des données de démonstration
      if (snapshot.empty) {
        console.log('Aucune opportunité trouvée, ajout de données de démonstration');
        await seedMockOpportunities();
        fetchOpportunities(); // Récupérer à nouveau après l'ajout des données de démo
        return;
      }
      
      const fetchedOpportunities = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Gérer les données de dates qui peuvent être des Timestamp Firestore
        let createdAtStr = '';
        let updatedAtStr = '';
        let expectedCloseDateStr = '';
        
        if (data.createdAt instanceof Timestamp) {
          createdAtStr = data.createdAt.toDate().toISOString();
        } else if (data.createdAt) {
          createdAtStr = new Date(data.createdAt).toISOString();
        } else {
          createdAtStr = new Date().toISOString();
        }
        
        if (data.updatedAt instanceof Timestamp) {
          updatedAtStr = data.updatedAt.toDate().toISOString();
        } else if (data.updatedAt) {
          updatedAtStr = new Date(data.updatedAt).toISOString();
        }
        
        if (data.expectedCloseDate instanceof Timestamp) {
          expectedCloseDateStr = data.expectedCloseDate.toDate().toISOString().split('T')[0];
        } else if (data.expectedCloseDate) {
          expectedCloseDateStr = new Date(data.expectedCloseDate).toISOString().split('T')[0];
        } else {
          expectedCloseDateStr = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        }
        
        return {
          id: doc.id,
          ...data,
          createdAt: createdAtStr,
          updatedAt: updatedAtStr || createdAtStr,
          expectedCloseDate: expectedCloseDateStr,
          value: Number(data.value) || 0,
          probability: Number(data.probability) || 0
        } as Opportunity;
      });
      
      setOpportunities(fetchedOpportunities);
      setError(null);
    } catch (err) {
      console.error('Error fetching opportunities:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const addOpportunity = async (data: OpportunityFormData) => {
    try {
      const opportunitiesRef = collection(db, COLLECTIONS.CRM.OPPORTUNITIES);
      
      const opportunityData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        value: Number(data.value) || 0,
        probability: Number(data.probability) || 0
      };
      
      const newOpportunityRef = await addDoc(opportunitiesRef, opportunityData);
      
      await fetchOpportunities();
      
      return newOpportunityRef.id;
    } catch (err) {
      console.error('Error adding opportunity:', err);
      throw err;
    }
  };

  const updateOpportunity = async (id: string, data: Partial<OpportunityFormData>) => {
    try {
      const opportunityRef = doc(db, COLLECTIONS.CRM.OPPORTUNITIES, id);
      
      const updateData = {
        ...data,
        updatedAt: serverTimestamp(),
        value: data.value ? Number(data.value) : undefined,
        probability: data.probability ? Number(data.probability) : undefined
      };
      
      await updateDoc(opportunityRef, updateData);
      
      await fetchOpportunities();
      
      return true;
    } catch (err) {
      console.error('Error updating opportunity:', err);
      throw err;
    }
  };

  // Seed mock data if collection is empty
  const seedMockOpportunities = async () => {
    try {
      const opportunitiesRef = collection(db, COLLECTIONS.CRM.OPPORTUNITIES);
      
      const mockOpportunities = [
        {
          name: 'Projet CRM Tech Solutions',
          clientName: 'Tech Solutions',
          contactName: 'Jean Dupont',
          contactEmail: 'jean@techsolutions.fr',
          contactPhone: '01 23 45 67 89',
          stage: OpportunityStage.PROPOSAL,
          value: 25000,
          probability: 70,
          expectedCloseDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          description: 'Implémentation d\'une solution CRM pour Tech Solutions',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          name: 'Renouvellement licence Global Industries',
          clientName: 'Global Industries',
          contactName: 'Marie Lambert',
          contactEmail: 'marie@global-industries.fr',
          contactPhone: '01 98 76 54 32',
          stage: OpportunityStage.NEGOTIATION,
          value: 12000,
          probability: 90,
          expectedCloseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          description: 'Renouvellement des licences logicielles pour 50 utilisateurs',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        },
        {
          name: 'Formation Smart Digital',
          clientName: 'Smart Digital',
          contactName: 'Pierre Legrand',
          contactEmail: 'pierre@smartdigital.fr',
          contactPhone: '01 45 67 89 01',
          stage: OpportunityStage.DISCOVERY,
          value: 8500,
          probability: 40,
          expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          description: 'Formation sur nos outils pour l\'équipe marketing',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }
      ];
      
      const promises = mockOpportunities.map(opportunity => 
        addDoc(opportunitiesRef, opportunity)
      );
      
      await Promise.all(promises);
      console.log('Données de démonstration des opportunités ajoutées avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout des données de démonstration:', error);
    }
  };

  return {
    opportunities,
    isLoading,
    error,
    addOpportunity,
    updateOpportunity,
    fetchOpportunities
  };
};
