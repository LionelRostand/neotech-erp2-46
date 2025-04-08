
import { OpportunityStage } from '../../types/crm-types';

export const useOpportunityUtils = () => {
  // Get all stages with proper labels for display
  const getAllStages = () => {
    return [
      { value: OpportunityStage.LEAD, label: 'Prospect' },
      { value: OpportunityStage.DISCOVERY, label: 'Découverte' },
      { value: OpportunityStage.PROPOSAL, label: 'Proposition' },
      { value: OpportunityStage.NEGOTIATION, label: 'Négociation' },
      { value: OpportunityStage.CLOSING, label: 'Finalisation' },
      { value: OpportunityStage.CLOSED_WON, label: 'Gagnée' },
      { value: OpportunityStage.CLOSED_LOST, label: 'Perdue' }
    ];
  };

  // Get color for a stage (for visual representation)
  const getStageColor = (stage: OpportunityStage) => {
    switch (stage) {
      case OpportunityStage.LEAD:
        return 'bg-blue-100 text-blue-800';
      case OpportunityStage.DISCOVERY:
        return 'bg-purple-100 text-purple-800';
      case OpportunityStage.PROPOSAL:
        return 'bg-amber-100 text-amber-800';
      case OpportunityStage.NEGOTIATION:
        return 'bg-orange-100 text-orange-800';
      case OpportunityStage.CLOSING:
        return 'bg-cyan-100 text-cyan-800';
      case OpportunityStage.CLOSED_WON:
        return 'bg-green-100 text-green-800';
      case OpportunityStage.CLOSED_LOST:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get stage label from value
  const getStageLabel = (stage: OpportunityStage) => {
    const allStages = getAllStages();
    const stageObj = allStages.find(s => s.value === stage);
    return stageObj ? stageObj.label : 'Inconnu';
  };

  // Format currency for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR',
      maximumFractionDigits: 0 
    }).format(value);
  };

  return {
    getAllStages,
    getStageColor,
    getStageLabel,
    formatCurrency
  };
};
