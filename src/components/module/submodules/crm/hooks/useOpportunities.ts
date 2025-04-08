
import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, Timestamp, getDocs, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Opportunity, OpportunityFormData, OpportunityStage } from '../types/crm-types';
import { toast } from 'sonner';

export const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load opportunities from Firestore
  useEffect(() => {
    const loadOpportunities = async () => {
      setIsLoading(true);
      try {
        const opportunitiesCollection = collection(db, COLLECTIONS.CRM.OPPORTUNITIES);
        const q = query(opportunitiesCollection, orderBy('updatedAt', 'desc'));
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const opportunitiesData = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || '',
              clientId: data.clientId || '',
              clientName: data.clientName || '',
              prospectId: data.prospectId || '',
              contactName: data.contactName || '',
              contactEmail: data.contactEmail || '',
              contactPhone: data.contactPhone || '',
              value: data.value || 0,
              stage: data.stage as OpportunityStage,
              probability: data.probability || 0,
              expectedCloseDate: data.expectedCloseDate || '',
              description: data.description || '',
              products: data.products || [],
              source: data.source || '',
              notes: data.notes || '',
              assignedTo: data.assignedTo || '',
              ownerName: data.ownerName || '',
              createdAt: data.createdAt ? new Date(data.createdAt.toDate()).toISOString() : new Date().toISOString(),
              updatedAt: data.updatedAt ? new Date(data.updatedAt.toDate()).toISOString() : new Date().toISOString(),
              nextContact: data.nextContact || '',
              title: data.title || ''
            } as Opportunity;
          });
          
          setOpportunities(opportunitiesData);
          setError(null);
          setIsLoading(false);
        }, (err) => {
          console.error('Error loading opportunities:', err);
          setError(err);
          setIsLoading(false);
          toast.error('Erreur lors du chargement des opportunités');
        });
        
        return () => unsubscribe();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Une erreur inconnue est survenue');
        console.error('Error loading opportunities:', error);
        setError(error);
        setIsLoading(false);
        toast.error('Erreur lors du chargement des opportunités');
      }
    };
    
    loadOpportunities();
  }, []);
  
  // Add a new opportunity to Firestore
  const addOpportunity = useCallback(async (data: OpportunityFormData): Promise<Opportunity> => {
    setIsLoading(true);
    
    try {
      const opportunitiesCollection = collection(db, COLLECTIONS.CRM.OPPORTUNITIES);
      
      // Parse numeric values
      const value = typeof data.value === 'string' ? parseFloat(data.value) || 0 : data.value;
      
      const opportunityData = {
        name: data.name,
        clientId: data.clientId || '',
        clientName: data.clientName || '',
        prospectId: data.prospectId || '',
        contactName: data.contactName || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        value,
        stage: data.stage,
        probability: data.probability || 0,
        expectedCloseDate: data.expectedCloseDate || '',
        description: data.description || '',
        products: data.products || [],
        source: data.source || '',
        notes: data.notes || '',
        assignedTo: data.assignedTo || '',
        ownerName: data.ownerName || '',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        nextContact: data.nextContact || '',
        title: data.title || ''
      };
      
      const docRef = await addDoc(opportunitiesCollection, opportunityData);
      
      const newOpportunity: Opportunity = {
        id: docRef.id,
        ...opportunityData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      toast.success('Opportunité ajoutée avec succès');
      return newOpportunity;
    } catch (error) {
      console.error('Error adding opportunity:', error);
      toast.error('Erreur lors de l\'ajout de l\'opportunité');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update an existing opportunity in Firestore
  const updateOpportunity = useCallback(async (id: string, data: Partial<OpportunityFormData>): Promise<Opportunity> => {
    setIsLoading(true);
    
    try {
      const opportunityRef = doc(db, COLLECTIONS.CRM.OPPORTUNITIES, id);
      
      // Parse numeric values if they are provided as strings
      const value = data.value !== undefined 
        ? (typeof data.value === 'string' ? parseFloat(data.value) || 0 : data.value) 
        : undefined;
      
      const updateData: any = {
        ...data,
        value: value,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(opportunityRef, updateData);
      
      const updatedOpportunity: Opportunity = {
        id,
        ...data,
        value: value !== undefined ? value : 0,
        updatedAt: new Date().toISOString(),
        createdAt: '',  // This will be overwritten by the actual value from Firestore
        // Adding required fields with placeholder values to satisfy TypeScript
        name: '',
        stage: OpportunityStage.LEAD,
        probability: 0
      } as Opportunity;
      
      toast.success('Opportunité mise à jour avec succès');
      return updatedOpportunity;
    } catch (error) {
      console.error('Error updating opportunity:', error);
      toast.error('Erreur lors de la mise à jour de l\'opportunité');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update opportunity stage
  const updateOpportunityStage = useCallback(async (id: string, stage: OpportunityStage): Promise<Opportunity> => {
    setIsLoading(true);
    
    try {
      const opportunityRef = doc(db, COLLECTIONS.CRM.OPPORTUNITIES, id);
      
      // Update probability based on stage
      let probability = 0;
      
      switch (stage) {
        case OpportunityStage.LEAD:
          probability = 10;
          break;
        case OpportunityStage.DISCOVERY:
          probability = 30;
          break;
        case OpportunityStage.PROPOSAL:
          probability = 50;
          break;
        case OpportunityStage.NEGOTIATION:
          probability = 70;
          break;
        case OpportunityStage.CLOSING:
          probability = 90;
          break;
        case OpportunityStage.CLOSED_WON:
          probability = 100;
          break;
        case OpportunityStage.CLOSED_LOST:
          probability = 0;
          break;
      }
      
      const updateData = {
        stage,
        probability,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(opportunityRef, updateData);
      
      const updatedOpportunity = opportunities.find(opp => opp.id === id);
      if (!updatedOpportunity) {
        throw new Error('Opportunity not found');
      }
      
      const result = {
        ...updatedOpportunity,
        stage,
        probability,
        updatedAt: new Date().toISOString()
      };
      
      toast.success('Statut mis à jour avec succès');
      return result;
    } catch (error) {
      console.error('Error updating opportunity stage:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [opportunities]);
  
  // Delete an opportunity from Firestore
  const deleteOpportunity = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      const opportunityRef = doc(db, COLLECTIONS.CRM.OPPORTUNITIES, id);
      await deleteDoc(opportunityRef);
      
      toast.success('Opportunité supprimée avec succès');
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      toast.error('Erreur lors de la suppression de l\'opportunité');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return {
    opportunities,
    isLoading,
    error,
    addOpportunity,
    updateOpportunity,
    updateOpportunityStage,
    deleteOpportunity
  };
};
