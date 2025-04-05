
import { Opportunity } from '../../types/crm-types';
import { CircleDollarSign, AlertCircle, CheckCircle2, XCircle, Clock, BarChart, FileText, Send, PauseCircle } from 'lucide-react';

export const useOpportunityUtils = () => {
  // Get label for opportunity stage
  const getStageLabel = (stage: string): string => {
    switch (stage) {
      case 'lead':
        return 'Lead';
      case 'qualified':
        return 'Qualifié';
      case 'needs-analysis':
        return 'Analyse';
      case 'proposal':
        return 'Proposition';
      case 'negotiation':
        return 'Négociation';
      case 'closed-won':
        return 'Gagné';
      case 'closed-lost':
        return 'Perdu';
      case 'new':
        return 'Nouveau';
      case 'quote_sent':
        return 'Devis envoyé';
      case 'pending':
        return 'En attente';
      case 'won':
        return 'Gagné';
      case 'lost':
        return 'Perdu';
      default:
        return stage;
    }
  };

  // Get color for opportunity stage badge
  const getStageBadgeColor = (stage: string): string => {
    switch (stage) {
      case 'lead':
        return 'bg-blue-200 text-blue-800';
      case 'qualified':
        return 'bg-indigo-200 text-indigo-800';
      case 'needs-analysis':
        return 'bg-purple-200 text-purple-800';
      case 'proposal':
        return 'bg-orange-200 text-orange-800';
      case 'negotiation':
        return 'bg-yellow-200 text-yellow-800';
      case 'closed-won':
      case 'won':
        return 'bg-green-200 text-green-800';
      case 'closed-lost':
      case 'lost':
        return 'bg-red-200 text-red-800';
      case 'new':
        return 'bg-blue-200 text-blue-800';
      case 'quote_sent':
        return 'bg-cyan-200 text-cyan-800';
      case 'pending':
        return 'bg-amber-200 text-amber-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  // Get color for opportunity stage (for charts, kanban etc.)
  const getStageColor = (stage: string): string => {
    switch (stage) {
      case 'lead':
        return '#3b82f6'; // blue-500
      case 'qualified':
        return '#6366f1'; // indigo-500
      case 'needs-analysis':
        return '#8b5cf6'; // purple-500
      case 'proposal':
        return '#f97316'; // orange-500
      case 'negotiation':
        return '#eab308'; // yellow-500
      case 'closed-won':
      case 'won':
        return '#22c55e'; // green-500
      case 'closed-lost':
      case 'lost':
        return '#ef4444'; // red-500
      case 'new':
        return '#3b82f6'; // blue-500
      case 'quote_sent':
        return '#06b6d4'; // cyan-500
      case 'pending':
        return '#f59e0b'; // amber-500
      default:
        return '#6b7280'; // gray-500
    }
  };

  // Get icon for opportunity stage
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'lead':
        return BarChart;
      case 'qualified':
        return AlertCircle;
      case 'needs-analysis':
        return BarChart;
      case 'proposal':
        return FileText;
      case 'negotiation':
        return CircleDollarSign;
      case 'closed-won':
      case 'won':
        return CheckCircle2;
      case 'closed-lost':
      case 'lost':
        return XCircle;
      case 'new':
        return Clock;
      case 'quote_sent':
        return Send;
      case 'pending':
        return PauseCircle;
      default:
        return AlertCircle;
    }
  };

  // Filter opportunities based on search term and status filter
  const filterOpportunities = (opportunities: Opportunity[], searchTerm: string, stageFilter: string): Opportunity[] => {
    return opportunities.filter(opportunity => {
      // Filter by stage if provided
      if (stageFilter && opportunity.stage !== stageFilter) {
        return false;
      }
      
      // Filter by search term if provided
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          opportunity.name.toLowerCase().includes(searchTermLower) ||
          (opportunity.clientName && opportunity.clientName.toLowerCase().includes(searchTermLower)) ||
          (opportunity.contactName && opportunity.contactName.toLowerCase().includes(searchTermLower)) ||
          (opportunity.description && opportunity.description.toLowerCase().includes(searchTermLower))
        );
      }
      
      return true;
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
