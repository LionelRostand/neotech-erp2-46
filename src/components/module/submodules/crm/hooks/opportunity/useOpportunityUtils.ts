
import { useCallback } from 'react';
import { OpportunityStage } from '../../types/crm-types';

export const useOpportunityUtils = () => {
  const getStageLabel = useCallback((stage: OpportunityStage) => {
    switch (stage) {
      case OpportunityStage.LEAD:
        return 'Prospection';
      case OpportunityStage.DISCOVERY:
        return 'Qualification';
      case OpportunityStage.PROPOSAL:
        return 'Proposition';
      case OpportunityStage.NEGOTIATION:
        return 'Négociation';
      case OpportunityStage.CLOSED_WON:
        return 'Clôturée (gagnée)';
      case OpportunityStage.CLOSED_LOST:
        return 'Perdue';
      default:
        return 'Inconnu';
    }
  }, []);

  const getStageColor = useCallback((stage: OpportunityStage) => {
    switch (stage) {
      case OpportunityStage.LEAD:
        return 'bg-blue-100 text-blue-800';
      case OpportunityStage.DISCOVERY:
        return 'bg-purple-100 text-purple-800';
      case OpportunityStage.PROPOSAL:
        return 'bg-amber-100 text-amber-800';
      case OpportunityStage.NEGOTIATION:
        return 'bg-orange-100 text-orange-800';
      case OpportunityStage.CLOSED_WON:
        return 'bg-green-100 text-green-800';
      case OpportunityStage.CLOSED_LOST:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const getAllStages = useCallback(() => {
    return [
      { value: OpportunityStage.LEAD, label: 'Prospection' },
      { value: OpportunityStage.DISCOVERY, label: 'Qualification' },
      { value: OpportunityStage.PROPOSAL, label: 'Proposition' },
      { value: OpportunityStage.NEGOTIATION, label: 'Négociation' },
      { value: OpportunityStage.CLOSED_WON, label: 'Clôturée (gagnée)' },
      { value: OpportunityStage.CLOSED_LOST, label: 'Perdue' },
    ];
  }, []);

  return {
    getStageLabel,
    getStageColor,
    getAllStages,
  };
};
