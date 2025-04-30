
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface EmployeeStatusBadgeProps {
  status: string;
}

const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status }) => {
  let statusText: string;
  let className: string;

  switch (status.toLowerCase()) {
    case 'active':
    case 'actif':
      statusText = 'Actif';
      className = 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      break;
    case 'onleave':
    case 'en congé':
      statusText = 'En congé';
      className = 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200';
      break;
    case 'inactive':
    case 'inactif':
      statusText = 'Inactif';
      className = 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
      break;
    case 'suspendu':
      statusText = 'Suspendu';
      className = 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
      break;
    default:
      statusText = status || 'Inconnu';
      className = 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200';
  }

  return (
    <Badge variant="outline" className={`${className}`}>
      {statusText}
    </Badge>
  );
};

export default EmployeeStatusBadge;
