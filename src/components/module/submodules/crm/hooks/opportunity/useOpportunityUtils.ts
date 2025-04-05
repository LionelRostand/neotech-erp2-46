
import { Opportunity, OpportunityStage } from '../../types/crm-types';

export const useOpportunityUtils = () => {
  /**
   * Gets the badge class for an opportunity stage
   */
  const getStageBadgeClass = (stage: OpportunityStage): string => {
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
  };

  /**
   * Gets the display text for an opportunity stage
   */
  const getStageText = (stage: OpportunityStage): string => {
    switch (stage) {
      case OpportunityStage.LEAD:
        return 'Prospect';
      case OpportunityStage.DISCOVERY:
        return 'Découverte';
      case OpportunityStage.PROPOSAL:
        return 'Proposition';
      case OpportunityStage.NEGOTIATION:
        return 'Négociation';
      case OpportunityStage.CLOSED_WON:
        return 'Gagné';
      case OpportunityStage.CLOSED_LOST:
        return 'Perdu';
      default:
        return 'Inconnu';
    }
  };

  /**
   * Get all available stages
   */
  const getAllStages = (): { value: OpportunityStage; label: string }[] => {
    return [
      { value: OpportunityStage.LEAD, label: 'Prospect' },
      { value: OpportunityStage.DISCOVERY, label: 'Découverte' },
      { value: OpportunityStage.PROPOSAL, label: 'Proposition' },
      { value: OpportunityStage.NEGOTIATION, label: 'Négociation' },
      { value: OpportunityStage.CLOSED_WON, label: 'Gagné' },
      { value: OpportunityStage.CLOSED_LOST, label: 'Perdu' }
    ];
  };

  /**
   * Format amount with currency
   */
  const formatAmount = (amount: number | undefined): string => {
    if (amount === undefined) return 'Non défini';
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  /**
   * Format probability as percentage
   */
  const formatProbability = (probability: number | undefined): string => {
    if (probability === undefined) return 'Non défini';
    return `${probability}%`;
  };

  /**
   * Format date
   */
  const formatDate = (date: string | undefined): string => {
    if (!date) return 'Non défini';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  /**
   * Filter opportunities by search term
   */
  const filterOpportunities = (opportunities: Opportunity[], searchTerm: string, stageFilter: string): Opportunity[] => {
    return opportunities.filter(opportunity => {
      // Apply stage filter
      const matchesStage = stageFilter === 'all' || opportunity.stage === stageFilter;
      
      // Apply search term
      const matchesSearch = searchTerm === '' || 
        opportunity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opportunity.clientName && opportunity.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (opportunity.contactName && opportunity.contactName.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesStage && matchesSearch;
    });
  };

  /**
   * Group opportunities by stage for Kanban view
   */
  const groupOpportunitiesByStage = (opportunities: Opportunity[]) => {
    const grouped: Record<OpportunityStage, Opportunity[]> = {
      [OpportunityStage.LEAD]: [],
      [OpportunityStage.DISCOVERY]: [],
      [OpportunityStage.PROPOSAL]: [],
      [OpportunityStage.NEGOTIATION]: [],
      [OpportunityStage.CLOSED_WON]: [],
      [OpportunityStage.CLOSED_LOST]: []
    };

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
    formatAmount,
    formatProbability,
    formatDate,
    filterOpportunities,
    groupOpportunitiesByStage
  };
};
