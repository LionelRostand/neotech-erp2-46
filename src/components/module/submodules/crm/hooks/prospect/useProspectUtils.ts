
import { Prospect } from '../../types/crm-types';

export const useProspectUtils = () => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-red-100 text-red-800';
      case 'warm':
        return 'bg-orange-100 text-orange-800';
      case 'cold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        return status;
    }
  };

  const filterProspects = (
    prospects: Prospect[], 
    searchTerm: string, 
    statusFilter: string
  ) => {
    return prospects.filter(prospect => {
      const matchesSearch = 
        prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter ? prospect.status === statusFilter : true;
      
      return matchesSearch && matchesStatus;
    });
  };

  return {
    getStatusBadgeClass,
    getStatusText,
    filterProspects
  };
};
