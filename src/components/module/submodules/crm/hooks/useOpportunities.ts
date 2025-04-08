
import { useState, useEffect, useCallback } from 'react';
import { Opportunity, OpportunityFormData, OpportunityStage } from '../types/crm-types';
import { mockOpportunities } from '../data/mockOpportunities';
import { toast } from 'sonner';
import { useOpportunityUtils } from './opportunity/useOpportunityUtils';

export const useOpportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Load mock opportunities data
  useEffect(() => {
    const loadOpportunities = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be a fetch call to your API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setOpportunities(mockOpportunities);
        setError(null);
      } catch (err) {
        console.error('Error loading opportunities:', err);
        setError(err instanceof Error ? err : new Error('Failed to load opportunities'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadOpportunities();
  }, []);
  
  // Add a new opportunity
  const addOpportunity = useCallback(async (data: OpportunityFormData): Promise<Opportunity> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Parse numeric values
      const value = typeof data.value === 'string' ? parseFloat(data.value) || 0 : data.value;
      
      const newOpportunity: Opportunity = {
        id: Date.now().toString(),
        name: data.name,
        clientId: data.clientId,
        clientName: data.clientName,
        prospectId: data.prospectId,
        contactName: data.contactName || '',
        contactEmail: data.contactEmail || '',
        contactPhone: data.contactPhone || '',
        value,
        stage: data.stage,
        probability: data.probability,
        expectedCloseDate: data.expectedCloseDate,
        description: data.description,
        products: data.products,
        source: data.source,
        notes: data.notes,
        assignedTo: data.assignedTo,
        ownerName: data.ownerName,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nextContact: data.nextContact,
        title: data.title
      };
      
      setOpportunities(prev => [newOpportunity, ...prev]);
      return newOpportunity;
    } catch (error) {
      console.error('Error adding opportunity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update an existing opportunity
  const updateOpportunity = useCallback(async (id: string, data: Partial<OpportunityFormData>): Promise<Opportunity> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Parse numeric values if they are provided as strings
      const value = data.value !== undefined 
        ? (typeof data.value === 'string' ? parseFloat(data.value) || 0 : data.value) 
        : undefined;
      
      let updatedOpportunity: Opportunity | undefined;
      
      setOpportunities(prevOpportunities => {
        return prevOpportunities.map(opportunity => {
          if (opportunity.id === id) {
            updatedOpportunity = {
              ...opportunity,
              ...data,
              value: value !== undefined ? value : opportunity.value,
              updatedAt: new Date().toISOString()
            };
            return updatedOpportunity;
          }
          return opportunity;
        });
      });
      
      if (!updatedOpportunity) {
        throw new Error('Opportunity not found');
      }
      
      return updatedOpportunity;
    } catch (error) {
      console.error('Error updating opportunity:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update opportunity stage
  const updateOpportunityStage = useCallback(async (id: string, stage: OpportunityStage): Promise<Opportunity> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let updatedOpportunity: Opportunity | undefined;
      
      setOpportunities(prevOpportunities => {
        return prevOpportunities.map(opportunity => {
          if (opportunity.id === id) {
            // Update probability based on stage
            let probability = opportunity.probability;
            
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
            
            updatedOpportunity = {
              ...opportunity,
              stage,
              probability,
              updatedAt: new Date().toISOString()
            };
            
            return updatedOpportunity;
          }
          return opportunity;
        });
      });
      
      if (!updatedOpportunity) {
        throw new Error('Opportunity not found');
      }
      
      toast.success('Statut mis à jour avec succès');
      return updatedOpportunity;
    } catch (error) {
      console.error('Error updating opportunity stage:', error);
      toast.error('Erreur lors de la mise à jour du statut');
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
    updateOpportunityStage
  };
};
