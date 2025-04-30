
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EmployeeStatusBadgeProps {
  status: string;
  className?: string;
}

const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status, className = '' }) => {
  // Formatter le statut pour affichage
  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'active':
      case 'Actif':
        return 'Actif';
      case 'inactive':
      case 'Inactif':
        return 'Inactif';
      case 'onLeave':
      case 'En congé':
        return 'En congé';
      case 'Suspendu':
        return 'Suspendu';
      default:
        return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active':
      case 'Actif':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
      case 'Inactif':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'onLeave':
      case 'En congé':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Suspendu':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };
  
  return (
    <Badge variant="outline" className={`${getStatusColor(status)} ${className}`}>
      {getStatusDisplay(status)}
    </Badge>
  );
};

export default EmployeeStatusBadge;
