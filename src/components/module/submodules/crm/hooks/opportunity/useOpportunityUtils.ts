
import { Opportunity } from "../../types/crm-types";

export const useOpportunityUtils = () => {
  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'new':
        return 'Nouveau';
      case 'negotiation':
        return 'En négociation';
      case 'quote_sent':
        return 'Devis envoyé';
      case 'pending':
        return 'En attente';
      case 'won':
        return 'Gagné';
      case 'lost':
        return 'Perdu';
      default:
        return 'Inconnu';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'new':
        return 'bg-green-600';
      case 'negotiation':
        return 'bg-blue-600';
      case 'quote_sent':
        return 'bg-purple-600';
      case 'pending':
        return 'bg-orange-600';
      case 'won':
        return 'bg-emerald-600';
      case 'lost':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'new':
        return '🟢';
      case 'negotiation':
        return '🔵';
      case 'quote_sent':
        return '🟣';
      case 'pending':
        return '🟠';
      case 'won':
        return '✅';
      case 'lost':
        return '❌';
      default:
        return '⚪';
    }
  };

  const filterOpportunities = (
    opportunities: Opportunity[],
    searchTerm: string,
    stageFilter: string
  ) => {
    return opportunities.filter(opportunity => {
      // Filter by search term
      const matchesSearch = 
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.clientName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by stage
      const matchesStage = stageFilter === 'all' || opportunity.stage === stageFilter;
      
      return matchesSearch && matchesStage;
    });
  };

  return {
    getStageLabel,
    getStageColor,
    getStageIcon,
    filterOpportunities
  };
};
