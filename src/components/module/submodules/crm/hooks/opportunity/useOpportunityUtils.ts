
import { OpportunityStage } from '../../types/crm-types';

export const useOpportunityUtils = () => {
  // Get all opportunity stages with labels
  const getAllStages = () => [
    { value: OpportunityStage.LEAD, label: 'Prospect' },
    { value: OpportunityStage.DISCOVERY, label: 'Découverte' },
    { value: OpportunityStage.PROPOSAL, label: 'Proposition' },
    { value: OpportunityStage.NEGOTIATION, label: 'Négociation' },
    { value: OpportunityStage.CLOSING, label: 'Clôture' },
    { value: OpportunityStage.CLOSED_WON, label: 'Gagné' },
    { value: OpportunityStage.CLOSED_LOST, label: 'Perdu' }
  ];

  // Get stage color based on the stage
  const getStageColor = (stage: OpportunityStage) => {
    switch (stage) {
      case OpportunityStage.LEAD:
        return 'bg-slate-100 text-slate-800';
      case OpportunityStage.DISCOVERY:
        return 'bg-blue-100 text-blue-800';
      case OpportunityStage.PROPOSAL:
        return 'bg-purple-100 text-purple-800';
      case OpportunityStage.NEGOTIATION:
        return 'bg-amber-100 text-amber-800';
      case OpportunityStage.CLOSING:
        return 'bg-orange-100 text-orange-800';
      case OpportunityStage.CLOSED_WON:
        return 'bg-green-100 text-green-800';
      case OpportunityStage.CLOSED_LOST:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get stage label based on the stage
  const getStageLabel = (stage: OpportunityStage) => {
    const stageOption = getAllStages().find(option => option.value === stage);
    return stageOption ? stageOption.label : stage;
  };

  return {
    getAllStages,
    getStageColor,
    getStageLabel
  };
};
