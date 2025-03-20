
import { Prospect } from "../../types/crm-types";

export const useProspectUtils = () => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warm':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cold':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'hot':
        return 'Chaud';
      case 'warm':
        return 'Tiède';
      case 'cold':
        return 'Froid';
      default:
        return 'Inconnu';
    }
  };

  const filterProspects = (
    prospects: Prospect[],
    searchTerm: string,
    statusFilter: string
  ) => {
    return prospects.filter(prospect => {
      // Filter by search term
      const matchesSearch = 
        prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = statusFilter === 'all' || statusFilter === '' || prospect.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  };

  return {
    getStatusBadgeClass,
    getStatusText,
    filterProspects
  };
};
