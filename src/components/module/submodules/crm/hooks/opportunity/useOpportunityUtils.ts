
import { Opportunity } from '../../types/crm-types';
import { DollarSign, Users, FileText, CheckCircle, AlertTriangle, BarChart4, Handshake } from 'lucide-react';

export const useOpportunityUtils = () => {
  const getStageLabel = (stage: string): string => {
    switch (stage) {
      case 'lead': return 'Prospect';
      case 'qualified': return 'Qualifié';
      case 'needs-analysis': return 'Analyse des besoins';
      case 'proposal': return 'Proposition';
      case 'negotiation': return 'Négociation';
      case 'closed-won': return 'Gagnée';
      case 'closed-lost': return 'Perdue';
      case 'new': return 'Nouveau';
      case 'quote_sent': return 'Devis envoyé';
      case 'pending': return 'En attente';
      case 'won': return 'Gagnée';
      case 'lost': return 'Perdue';
      default: return 'Inconnu';
    }
  };

  const getStageBadgeColor = (stage: string): string => {
    switch (stage) {
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'qualified': return 'bg-indigo-100 text-indigo-800';
      case 'needs-analysis': return 'bg-purple-100 text-purple-800';
      case 'proposal': return 'bg-amber-100 text-amber-800';
      case 'negotiation': return 'bg-orange-100 text-orange-800';
      case 'closed-won': return 'bg-green-100 text-green-800';
      case 'closed-lost': return 'bg-red-100 text-red-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'quote_sent': return 'bg-amber-100 text-amber-800';
      case 'pending': return 'bg-purple-100 text-purple-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getStageColor = (stage: string): string => {
    switch (stage) {
      case 'lead': return 'bg-blue-500';
      case 'qualified': return 'bg-indigo-500';
      case 'needs-analysis': return 'bg-purple-500';
      case 'proposal': return 'bg-amber-500';
      case 'negotiation': return 'bg-orange-500';
      case 'closed-won': return 'bg-green-500';
      case 'closed-lost': return 'bg-red-500';
      case 'new': return 'bg-blue-500';
      case 'quote_sent': return 'bg-amber-500';
      case 'pending': return 'bg-purple-500';
      case 'won': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Adding the missing getStageIcon function
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'lead':
      case 'new':
        return Users;
      case 'qualified':
        return BarChart4;
      case 'needs-analysis':
        return FileText;
      case 'proposal':
      case 'quote_sent':
        return DollarSign;
      case 'negotiation':
      case 'pending':
        return Handshake;
      case 'closed-won':
      case 'won':
        return CheckCircle;
      case 'closed-lost':
      case 'lost':
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const filterOpportunities = (
    opportunities: Opportunity[] | undefined, 
    searchTerm: string, 
    stageFilter: string
  ): Opportunity[] => {
    if (!opportunities) return [];

    return opportunities.filter((opportunity) => {
      const matchesSearch = 
        (opportunity.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (opportunity.title?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
        (opportunity.contactName && opportunity.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (opportunity.clientName && opportunity.clientName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStage = stageFilter === 'all' ? true : opportunity.stage === stageFilter;

      return matchesSearch && matchesStage;
    });
  };

  return {
    getStageLabel,
    getStageBadgeColor,
    getStageColor,
    getStageIcon,
    filterOpportunities
  };
};
