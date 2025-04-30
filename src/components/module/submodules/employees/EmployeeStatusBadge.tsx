
import React from 'react';

interface EmployeeStatusBadgeProps {
  status: 'active' | 'inactive' | 'onLeave' | 'terminated' | 'Actif' | 'En congé' | 'Suspendu' | 'Inactif' | string;
  size?: 'sm' | 'md' | 'lg';
}

const EmployeeStatusBadge: React.FC<EmployeeStatusBadgeProps> = ({ status, size = 'md' }) => {
  // Fonction pour normaliser le statut (gestion de la langue)
  const normalizeStatus = (status: string): string => {
    const statusLower = status.toLowerCase();
    
    if (statusLower === 'active' || statusLower === 'actif') {
      return 'active';
    } else if (statusLower === 'inactive' || statusLower === 'inactif') {
      return 'inactive';
    } else if (statusLower === 'onleave' || statusLower === 'en congé') {
      return 'onLeave';
    } else if (statusLower === 'terminated' || statusLower === 'suspendu') {
      return 'terminated';
    } else {
      return statusLower;
    }
  };
  
  // Obtenir les styles en fonction du statut normalisé
  const getBadgeStyles = (normalizedStatus: string) => {
    switch (normalizedStatus) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'onLeave':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };
  
  // Obtenir l'intitulé à afficher en fonction du statut
  const getDisplayText = (status: string, normalizedStatus: string) => {
    if (status === 'active') return 'Actif';
    if (status === 'inactive') return 'Inactif';
    if (status === 'onLeave') return 'En congé';
    if (status === 'terminated') return 'Suspendu';
    if (status === 'Actif') return 'Actif';
    if (status === 'Inactif') return 'Inactif';
    if (status === 'En congé') return 'En congé';
    if (status === 'Suspendu') return 'Suspendu';
    
    // Fallback pour les statuts non reconnus
    return status;
  };
  
  const normalizedStatus = normalizeStatus(status);
  const badgeStyles = getBadgeStyles(normalizedStatus);
  const displayText = getDisplayText(status, normalizedStatus);
  
  // Taille du badge
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  };
  
  return (
    <span 
      className={`inline-flex items-center rounded-full border ${badgeStyles} ${sizeClasses[size]} font-medium`}
    >
      <span className={`rounded-full ${normalizedStatus === 'active' ? 'bg-green-500' : normalizedStatus === 'onLeave' ? 'bg-orange-500' : normalizedStatus === 'terminated' ? 'bg-red-500' : 'bg-gray-500'} h-1.5 w-1.5 mr-1.5`}></span>
      {displayText}
    </span>
  );
};

export default EmployeeStatusBadge;
