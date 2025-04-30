
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EmployeeStatusBadgeProps {
  status: string;
  className?: string;
}

const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status, className = '' }) => {
  // Format status for display
  const getStatusDisplay = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'active':
      case 'actif':
        return 'Actif';
      case 'inactive':
      case 'inactif':
        return 'Inactif';
      case 'onleave':
      case 'en congé':
        return 'En congé';
      case 'suspendu':
        return 'Suspendu';
      default:
        return status || 'Inconnu';
    }
  };
  
  // Get appropriate color for status
  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'active':
      case 'actif':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
      case 'inactif':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'onleave':
      case 'en congé':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'suspendu':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };
  
  return (
    <Badge variant="outline" className={`${getStatusColor(status || '')} ${className}`}>
      {getStatusDisplay(status || '')}
    </Badge>
  );
};

export default EmployeeStatusBadge;
