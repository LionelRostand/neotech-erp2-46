
import React from 'react';

interface EmployeeStatusBadgeProps {
  status: string;
}

const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status }) => {
  const getStatusConfig = (employeeStatus: string) => {
    const normalizedStatus = employeeStatus?.toLowerCase();
    
    switch (normalizedStatus) {
      case 'active':
      case 'actif':
        return { label: 'Actif', bgColor: 'bg-green-100 text-green-700' };
      case 'inactive':
      case 'inactif':
        return { label: 'Inactif', bgColor: 'bg-gray-100 text-gray-700' };
      case 'onleave':
      case 'en congé':
        return { label: 'En congé', bgColor: 'bg-blue-100 text-blue-700' };
      case 'suspended':
      case 'suspendu':
        return { label: 'Suspendu', bgColor: 'bg-amber-100 text-amber-700' };
      default:
        return { label: status || 'Inconnu', bgColor: 'bg-gray-100 text-gray-700' };
    }
  };

  const { label, bgColor } = getStatusConfig(status);

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${bgColor}`}>
      {label}
    </span>
  );
};

export default EmployeeStatusBadge;
