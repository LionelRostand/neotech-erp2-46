
import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Opportunity, OpportunityFormData, OpportunityStage } from '../types/crm-types';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const opportunitiesCollectionRef = collection(db, COLLECTIONS.CRM.OPPORTUNITIES);

  // Fetch opportunities from Firestore
  useEffect(() => {
    const fetchOpportunities = async () => {
      setIsLoading(true);
      try {
        const q = query(opportunitiesCollectionRef, orderBy('updatedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
          // Si la collection est vide, utilisez les données simulées pour la démo
          console.log('Aucune opportunité trouvée, utilisation des données de démonstration');
          const mockData = await seedMockOpportunities();
          setOpportunities(mockData);
        } else {
          const fetchedOpportunities = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Opportunity[];
          
          setOpportunities(fetchedOpportunities);
        }
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des opportunités:', err);
        setError('Une erreur est survenue lors du chargement des opportunités');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Add a new opportunity to Firestore
  const addOpportunity = async (data: OpportunityFormData): Promise<Opportunity> => {
    try {
      // Convert string values to numbers where needed
      const valueAsNumber = typeof data.value === 'string' ? parseFloat(data.value) : data.value;
      const probabilityAsNumber = typeof data.probability === 'string' ? parseFloat(data.probability) : data.probability;
      const amountAsNumber = data.amount 
        ? (typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount) 
        : undefined;
      
      const newOpportunityData = {
        ...data,
        value: valueAsNumber,
        probability: probabilityAsNumber,
        amount: amountAsNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(opportunitiesCollectionRef, newOpportunityData);
      
      const newOpportunity: Opportunity = {
        id: docRef.id,
        ...data,
        value: valueAsNumber,
        probability: probabilityAsNumber,
        amount: amountAsNumber,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setOpportunities(prev => [newOpportunity, ...prev]);
      toast.success('Opportunité ajoutée avec succès');
      return newOpportunity;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'opportunité:', error);
      toast.error('Erreur lors de l\'ajout de l\'opportunité');
      throw error;
    }
  };

  // Update an existing opportunity in Firestore
  const updateOpportunity = async (id: string, data: Partial<OpportunityFormData>): Promise<Opportunity> => {
    try {
      const opportunityRef = doc(db, COLLECTIONS.CRM.OPPORTUNITIES, id);
      
      // Create updates object with type-safe properties
      const updates: Record<string, any> = {
        updatedAt: serverTimestamp()
      };
      
      // Copy all properties except for numeric ones that need conversion
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'value' && key !== 'probability' && key !== 'amount') {
          updates[key] = value;
        }
      });
      
      // Handle numeric properties separately with proper type conversion
      if (data.value !== undefined) {
        updates.value = typeof data.value === 'string' ? parseFloat(data.value) : data.value;
      }
      
      if (data.probability !== undefined) {
        updates.probability = typeof data.probability === 'string' ? parseFloat(data.probability) : data.probability;
      }
      
      if (data.amount !== undefined && data.amount !== null) {
        updates.amount = typeof data.amount === 'string' ? parseFloat(data.amount) : data.amount;
      }
      
      await updateDoc(opportunityRef, updates);
      
      // Create a new array of opportunities with the updated one
      const updatedOpportunities = opportunities.map(opp => {
        if (opp.id === id) {
          // Type cast to ensure we're returning an Opportunity
          return {
            ...opp,
            ...updates,
            updatedAt: new Date().toISOString(),
          } as Opportunity;
        }
        return opp;
      });
      
      setOpportunities(updatedOpportunities);
      const updatedOpportunity = updatedOpportunities.find(opp => opp.id === id);
      
      if (!updatedOpportunity) {
        throw new Error('Opportunity not found');
      }
      
      toast.success('Opportunité mise à jour avec succès');
      return updatedOpportunity;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'opportunité:', error);
      toast.error('Erreur lors de la mise à jour de l\'opportunité');
      throw error;
    }
  };

  // Delete an opportunity from Firestore
  const deleteOpportunity = async (id: string): Promise<void> => {
    try {
      const opportunityRef = doc(db, COLLECTIONS.CRM.OPPORTUNITIES, id);
      await deleteDoc(opportunityRef);
      
      setOpportunities(prev => prev.filter(opp => opp.id !== id));
      toast.success('Opportunité supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'opportunité:', error);
      toast.error('Erreur lors de la suppression de l\'opportunité');
      throw error;
    }
  };

  // Seed mock opportunities if collection is empty
  const seedMockOpportunities = async (): Promise<Opportunity[]> => {
    const mockOpportunities = getMockOpportunities();
    
    try {
      // Add mock opportunities to Firestore
      console.log('Ajout des données de démonstration dans Firestore');
      
      const createdOpportunities: Opportunity[] = [];
      
      for (const opp of mockOpportunities) {
        const { id, createdAt, updatedAt, ...oppData } = opp;
        
        const docRef = await addDoc(opportunitiesCollectionRef, {
          ...oppData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        createdOpportunities.push({
          ...opp,
          id: docRef.id
        });
      }
      
      return createdOpportunities;
    } catch (error) {
      console.error('Erreur lors de l\'ajout des données de démonstration:', error);
      return mockOpportunities;
    }
  };

  return {
    opportunities,
    isLoading,
    error,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity
  };
};

// Helper function to provide mock data
const getMockOpportunities = (): Opportunity[] => {
  // Mock data for opportunities
  return [
    {
      id: '1',
      name: 'Déploiement CRM',
      description: 'Mise en place d\'un CRM pour une entreprise de services',
      stage: OpportunityStage.PROPOSAL,
      clientName: 'ABC Corporation',
      contactName: 'Jean Dupont',
      contactEmail: 'jean@abc-corp.fr',
      contactPhone: '01 23 45 67 89',
      amount: 15000,
      value: 15000,
      probability: 70,
      expectedCloseDate: '2025-05-15',
      assignedTo: 'Sophie Martin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Refonte Site Web',
      description: 'Refonte complète du site web corporate',
      stage: OpportunityStage.DISCOVERY,
      clientName: 'Tech Solutions',
      contactName: 'Pierre Lefebvre',
      contactEmail: 'pierre@techsolutions.fr',
      contactPhone: '01 87 65 43 21',
      amount: 8500,
      value: 8500,
      probability: 50,
      expectedCloseDate: '2025-06-10',
      assignedTo: 'Marc Dubois',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Formation Excel Avancé',
      description: 'Formation pour 15 employés sur Excel avancé',
      stage: OpportunityStage.CLOSED_WON,
      clientName: 'Comptabilité Plus',
      contactName: 'Marie Lambert',
      contactEmail: 'marie@comptaplus.fr',
      contactPhone: '01 45 67 89 12',
      amount: 3000,
      value: 3000,
      probability: 100,
      expectedCloseDate: '2025-04-30',
      assignedTo: 'Sophie Martin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Audit Sécurité',
      description: 'Audit complet de la sécurité informatique',
      stage: OpportunityStage.NEGOTIATION,
      clientName: 'Banque Régionale',
      contactName: 'Thomas Richard',
      contactEmail: 'thomas@banqueregionale.fr',
      contactPhone: '01 23 56 78 90',
      amount: 12000,
      value: 12000,
      probability: 80,
      expectedCloseDate: '2025-05-20',
      assignedTo: 'Julie Moreau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      name: 'Maintenance Annuelle',
      description: 'Contrat de maintenance annuelle pour le parc informatique',
      stage: OpportunityStage.LEAD,
      clientName: 'Industrie Moderne',
      contactName: 'Philippe Garnier',
      contactEmail: 'philippe@industriemoderne.fr',
      contactPhone: '01 98 76 54 32',
      amount: 9500,
      value: 9500,
      probability: 30,
      expectedCloseDate: '2025-07-15',
      assignedTo: 'Marc Dubois',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '6',
      name: 'Développement Application Mobile',
      description: 'Développement d\'une application mobile de gestion clients',
      stage: OpportunityStage.PROPOSAL,
      clientName: 'MobileFirst',
      contactName: 'Claire Dubois',
      contactEmail: 'claire@mobilefirst.fr',
      contactPhone: '01 34 56 78 90',
      amount: 25000,
      value: 25000,
      probability: 60,
      expectedCloseDate: '2025-06-30',
      assignedTo: 'Julie Moreau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];
};
