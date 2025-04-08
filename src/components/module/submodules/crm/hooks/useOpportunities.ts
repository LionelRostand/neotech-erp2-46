
import { useState, useEffect } from 'react';
import { collection, query, orderBy, addDoc, updateDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Opportunity, OpportunityFormData, OpportunityStage } from '../types/crm-types';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

export const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch opportunities from Firebase
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        const opportunitiesRef = collection(db, COLLECTIONS.CRM.OPPORTUNITIES);
        const q = query(opportunitiesRef, orderBy('updatedAt', 'desc'));
        
        const querySnapshot = await getDocs(q);
        
        // Check if collection is empty and add mock data if needed
        if (querySnapshot.empty) {
          await seedMockOpportunities();
          fetchOpportunities(); // Recall this function to get the seeded data
          return;
        }
        
        const loadedOpportunities = querySnapshot.docs.map(doc => {
          const data = doc.data();
          
          // Format the dates properly
          let createdAtDate = '';
          let updatedAtDate = '';
          
          if (data.createdAt) {
            createdAtDate = data.createdAt.toDate ? 
              data.createdAt.toDate().toISOString() : 
              new Date(data.createdAt).toISOString();
          } else {
            createdAtDate = new Date().toISOString();
          }
          
          if (data.updatedAt) {
            updatedAtDate = data.updatedAt.toDate ? 
              data.updatedAt.toDate().toISOString() : 
              new Date(data.updatedAt).toISOString();
          } else {
            updatedAtDate = createdAtDate;
          }
          
          // Ensure valid stage value
          const stage = data.stage || 'lead';
          const validStage = Object.values(OpportunityStage).includes(stage as OpportunityStage) 
            ? stage as OpportunityStage 
            : OpportunityStage.LEAD;
            
          // Convert value to number
          const value = typeof data.value === 'number' ? 
            data.value : 
            parseFloat(data.value) || 0;
          
          return {
            id: doc.id,
            name: data.name || '',
            clientName: data.clientName || '',
            value: value,
            stage: validStage,
            probability: typeof data.probability === 'number' ? data.probability : parseInt(data.probability) || 0,
            expectedCloseDate: data.expectedCloseDate || '',
            createdAt: createdAtDate,
            updatedAt: updatedAtDate,
            owner: data.owner || '',
            description: data.description || '',
            products: data.products || [],
            source: data.source || '',
            notes: data.notes || '',
            contacts: data.contacts || [],
            contactName: data.contactName || '',
            contactEmail: data.contactEmail || '',
            contactPhone: data.contactPhone || ''
          } as Opportunity;
        });
        
        setOpportunities(loadedOpportunities);
        setError(null);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch opportunities'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Add a new opportunity to Firebase
  const addOpportunity = async (opportunityData: OpportunityFormData): Promise<void> => {
    try {
      const opportunitiesRef = collection(db, COLLECTIONS.CRM.OPPORTUNITIES);
      
      // Ensure valid stage and numeric values
      const validStage = Object.values(OpportunityStage).includes(opportunityData.stage as OpportunityStage) 
        ? opportunityData.stage 
        : OpportunityStage.LEAD;
      
      const value = typeof opportunityData.value === 'number' 
        ? opportunityData.value 
        : parseFloat(opportunityData.value as string) || 0;
        
      const probability = typeof opportunityData.probability === 'number' 
        ? opportunityData.probability 
        : parseInt(opportunityData.probability as string) || 0;
      
      const newOpportunity = {
        ...opportunityData,
        stage: validStage,
        value: value,
        probability: probability,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(opportunitiesRef, newOpportunity);
      
      // Add to local state with the new ID
      const now = new Date().toISOString();
      
      const newOppWithId: Opportunity = {
        id: docRef.id,
        name: opportunityData.name,
        clientName: opportunityData.clientName,
        value: value,
        stage: validStage as OpportunityStage,
        probability: probability,
        expectedCloseDate: opportunityData.expectedCloseDate,
        createdAt: now,
        updatedAt: now,
        owner: opportunityData.assignedTo || '',
        description: opportunityData.description || '',
        products: opportunityData.products || [],
        source: opportunityData.source || '',
        notes: opportunityData.notes || '',
        contacts: [],
        contactName: opportunityData.contactName || '',
        contactEmail: opportunityData.contactEmail || '',
        contactPhone: opportunityData.contactPhone || ''
      };
      
      setOpportunities(prevOpportunities => [newOppWithId, ...prevOpportunities]);
      
    } catch (err) {
      console.error('Error adding opportunity:', err);
      throw err instanceof Error ? err : new Error('Failed to add opportunity');
    }
  };

  // Update an opportunity in Firebase
  const updateOpportunity = async (id: string, opportunityData: OpportunityFormData): Promise<void> => {
    try {
      const opportunityRef = doc(db, COLLECTIONS.CRM.OPPORTUNITIES, id);
      
      // Ensure valid stage and numeric values
      const validStage = Object.values(OpportunityStage).includes(opportunityData.stage as OpportunityStage) 
        ? opportunityData.stage 
        : OpportunityStage.LEAD;
      
      const value = typeof opportunityData.value === 'number' 
        ? opportunityData.value 
        : parseFloat(opportunityData.value as string) || 0;
        
      const probability = typeof opportunityData.probability === 'number' 
        ? opportunityData.probability 
        : parseInt(opportunityData.probability as string) || 0;
      
      const updatedData = {
        ...opportunityData,
        stage: validStage,
        value: value,
        probability: probability,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(opportunityRef, updatedData);
      
      // Update in local state
      setOpportunities(prevOpportunities => 
        prevOpportunities.map(opp => 
          opp.id === id 
            ? { 
                ...opp, 
                ...opportunityData, 
                stage: validStage as OpportunityStage,
                value: value,
                probability: probability,
                updatedAt: new Date().toISOString() 
              } as Opportunity 
            : opp
        )
      );
      
    } catch (err) {
      console.error('Error updating opportunity:', err);
      throw err instanceof Error ? err : new Error('Failed to update opportunity');
    }
  };

  // Seed mock data if the collection is empty
  const seedMockOpportunities = async () => {
    try {
      const opportunitiesRef = collection(db, COLLECTIONS.CRM.OPPORTUNITIES);
      
      const mockOpportunities = [
        {
          name: 'Déploiement Réseau',
          clientName: 'TechCorp',
          value: 75000,
          stage: 'proposal',
          probability: 65,
          expectedCloseDate: '2023-12-20',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          owner: 'Julie Martin',
          description: 'Déploiement d\'un réseau sécurisé pour les 5 sites de TechCorp',
          products: ['Réseau sécurisé', 'VPN', 'Support technique'],
          source: 'Salon professionnel',
          notes: 'Client intéressé par une extension future',
          contacts: ['Marc Dupont (CTO)', 'Sophie Leroy (IT Manager)'],
          contactName: 'Marc Dupont',
          contactEmail: 'marc@techcorp.fr',
          contactPhone: '0123456789'
        },
        {
          name: 'Migration Cloud',
          clientName: 'InnovSolutions',
          value: 120000,
          stage: 'negotiation',
          probability: 80,
          expectedCloseDate: '2023-11-30',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          owner: 'Thomas Bernard',
          description: 'Migration de l\'infrastructure vers le cloud Azure',
          products: ['Azure Migration', 'Training', 'Support 24/7'],
          source: 'Référence client',
          notes: 'Budget confirmé pour Q4',
          contacts: ['Julien Petit (CEO)', 'Claire Dubois (COO)'],
          contactName: 'Julien Petit',
          contactEmail: 'julien@innovsolutions.fr',
          contactPhone: '0187654321'
        },
        {
          name: 'Équipement Bureau',
          clientName: 'MediaGroup',
          value: 45000,
          stage: 'lead',
          probability: 30,
          expectedCloseDate: '2024-01-15',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          owner: 'Sophie Mercier',
          description: 'Renouvellement de l\'équipement informatique',
          products: ['Ordinateurs portables', 'Écrans', 'Périphériques'],
          source: 'Site web',
          notes: 'Premier contact positif',
          contacts: ['Paul Martin (Procurement)'],
          contactName: 'Paul Martin',
          contactEmail: 'paul@mediagroup.fr',
          contactPhone: '0145678901'
        }
      ];
      
      // Add mock data to Firestore
      const promises = mockOpportunities.map(opportunity => 
        addDoc(opportunitiesRef, opportunity)
      );
      
      await Promise.all(promises);
      console.log('Mock opportunities seeded successfully');
      
    } catch (err) {
      console.error('Error seeding mock opportunities:', err);
    }
  };

  return {
    opportunities,
    isLoading,
    error,
    addOpportunity,
    updateOpportunity
  };
};
