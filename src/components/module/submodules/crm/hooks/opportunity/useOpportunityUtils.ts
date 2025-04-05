
import { OpportunityStage, Opportunity } from '../../types/crm-types';

export const useOpportunityUtils = () => {
  // Get CSS class for stage badge
  const getStageBadgeClass = (stage: OpportunityStage) => {
    switch (stage) {
      case 'prospection':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'qualification':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'proposition':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'négociation':
        return 'bg-amber-100 text-amber-800 hover:bg-amber-100';
      case 'clôturée':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'perdue':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  // Get readable text for stage
  const getStageText = (stage: OpportunityStage) => {
    switch (stage) {
      case 'prospection':
        return 'Prospection';
      case 'qualification':
        return 'Qualification';
      case 'proposition':
        return 'Proposition';
      case 'négociation':
        return 'Négociation';
      case 'clôturée':
        return 'Clôturée';
      case 'perdue':
        return 'Perdue';
      default:
        return stage;
    }
  };

  // Get human-readable label for stage
  const getStageLabel = (stage: OpportunityStage) => {
    return getStageText(stage);
  };

  // Get all available stages with labels
  const getAllStages = () => {
    return [
      { value: 'prospection', label: 'Prospection' },
      { value: 'qualification', label: 'Qualification' },
      { value: 'proposition', label: 'Proposition' },
      { value: 'négociation', label: 'Négociation' },
      { value: 'clôturée', label: 'Clôturée' },
      { value: 'perdue', label: 'Perdue' }
    ];
  };

  // Get stage order for sorting
  const getStageOrder = (stage: OpportunityStage) => {
    const stageOrder = {
      'prospection': 1,
      'qualification': 2,
      'proposition': 3,
      'négociation': 4,
      'clôturée': 5,
      'perdue': 6
    };
    return stageOrder[stage] || 99;
  };

  // Group opportunities by stage for kanban view
  const groupOpportunitiesByStage = (opportunities: Opportunity[]) => {
    const stages = getAllStages().map(s => s.value as OpportunityStage);
    const grouped: Record<OpportunityStage, Opportunity[]> = {} as Record<OpportunityStage, Opportunity[]>;
    
    // Initialize with empty arrays for each stage
    stages.forEach(stage => {
      grouped[stage] = [];
    });
    
    // Group opportunities by stage
    opportunities.forEach(opportunity => {
      if (grouped[opportunity.stage]) {
        grouped[opportunity.stage].push(opportunity);
      }
    });
    
    return grouped;
  };

  return {
    getStageBadgeClass,
    getStageText,
    getAllStages,
    getStageOrder,
    getStageLabel,
    groupOpportunitiesByStage
  };
};
