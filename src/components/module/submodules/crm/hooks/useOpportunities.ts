
import { useState, useEffect } from 'react';
import { Opportunity, OpportunityFormData, OpportunityStage } from '../types/crm-types';
import { toast } from 'sonner';

export const useOpportunities = () => {
  // Reuse the mockOpportunities data that's already defined in the codebase
  const { mockOpportunities } = useOpportunitiesData();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Simulate API call to fetch opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOpportunities(mockOpportunities);
        setError(null);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
        setError('Une erreur est survenue lors du chargement des opportunités');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Add a new opportunity
  const addOpportunity = async (data: OpportunityFormData): Promise<Opportunity> => {
    // Simulate API call to add an opportunity
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newOpportunity: Opportunity = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setOpportunities(prev => [newOpportunity, ...prev]);
    return newOpportunity;
  };

  // Update an existing opportunity
  const updateOpportunity = async (id: string, data: Partial<OpportunityFormData>): Promise<Opportunity> => {
    // Simulate API call to update an opportunity
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedOpportunities = opportunities.map(opp => {
      if (opp.id === id) {
        return {
          ...opp,
          ...data,
          updatedAt: new Date().toISOString(),
        };
      }
      return opp;
    });
    
    setOpportunities(updatedOpportunities);
    const updatedOpportunity = updatedOpportunities.find(opp => opp.id === id);
    
    if (!updatedOpportunity) {
      throw new Error('Opportunity not found');
    }
    
    return updatedOpportunity;
  };

  // Delete an opportunity
  const deleteOpportunity = async (id: string): Promise<void> => {
    // Simulate API call to delete an opportunity
    await new Promise(resolve => setTimeout(resolve, 500));
    setOpportunities(prev => prev.filter(opp => opp.id !== id));
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
const useOpportunitiesData = () => {
  // Mock data for opportunities
  const mockOpportunities: Opportunity[] = [
    {
      id: '1',
      title: 'Déploiement CRM',
      description: 'Mise en place d\'un CRM pour une entreprise de services',
      stage: OpportunityStage.PROPOSAL,
      clientName: 'ABC Corporation',
      contactName: 'Jean Dupont',
      contactEmail: 'jean@abc-corp.fr',
      contactPhone: '01 23 45 67 89',
      amount: 15000,
      probability: 70,
      expectedCloseDate: '2025-05-15',
      assignedTo: 'Sophie Martin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Refonte Site Web',
      description: 'Refonte complète du site web corporate',
      stage: OpportunityStage.DISCOVERY,
      clientName: 'Tech Solutions',
      contactName: 'Pierre Lefebvre',
      contactEmail: 'pierre@techsolutions.fr',
      contactPhone: '01 87 65 43 21',
      amount: 8500,
      probability: 50,
      expectedCloseDate: '2025-06-10',
      assignedTo: 'Marc Dubois',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Formation Excel Avancé',
      description: 'Formation pour 15 employés sur Excel avancé',
      stage: OpportunityStage.CLOSED_WON,
      clientName: 'Comptabilité Plus',
      contactName: 'Marie Lambert',
      contactEmail: 'marie@comptaplus.fr',
      contactPhone: '01 45 67 89 12',
      amount: 3000,
      probability: 100,
      expectedCloseDate: '2025-04-30',
      assignedTo: 'Sophie Martin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Audit Sécurité',
      description: 'Audit complet de la sécurité informatique',
      stage: OpportunityStage.NEGOTIATION,
      clientName: 'Banque Régionale',
      contactName: 'Thomas Richard',
      contactEmail: 'thomas@banqueregionale.fr',
      contactPhone: '01 23 56 78 90',
      amount: 12000,
      probability: 80,
      expectedCloseDate: '2025-05-20',
      assignedTo: 'Julie Moreau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '5',
      title: 'Maintenance Annuelle',
      description: 'Contrat de maintenance annuelle pour le parc informatique',
      stage: OpportunityStage.LEAD,
      clientName: 'Industrie Moderne',
      contactName: 'Philippe Garnier',
      contactEmail: 'philippe@industriemoderne.fr',
      contactPhone: '01 98 76 54 32',
      amount: 9500,
      probability: 30,
      expectedCloseDate: '2025-07-15',
      assignedTo: 'Marc Dubois',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '6',
      title: 'Développement Application Mobile',
      description: 'Développement d\'une application mobile de gestion clients',
      stage: OpportunityStage.PROPOSAL,
      clientName: 'MobileFirst',
      contactName: 'Claire Dubois',
      contactEmail: 'claire@mobilefirst.fr',
      contactPhone: '01 34 56 78 90',
      amount: 25000,
      probability: 60,
      expectedCloseDate: '2025-06-30',
      assignedTo: 'Julie Moreau',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  return { mockOpportunities };
};
