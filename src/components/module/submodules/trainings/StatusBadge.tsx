
import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface StatusBadgeProps {
  status: string;
  label?: string;
  variant?: 'outline' | 'success' | 'warning' | 'danger';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, variant: propVariant }) => {
  const getVariant = () => {
    // Use the provided variant if available, otherwise determine based on status
    if (propVariant) return propVariant;
    
    switch (status) {
      case 'scheduled':
      case 'Planifiée':
        return 'outline' as const;
      case 'in_progress':
      case 'En cours':
        return 'warning' as const;
      case 'completed':
      case 'Terminée':
        return 'success' as const;
      case 'cancelled':
      case 'Annulée':
        return 'danger' as const;
      default:
        return 'outline' as const;
    }
  };

  const getLabel = () => {
    if (label) return label;
    
    switch (status) {
      case 'scheduled':
        return 'Planifiée';
      case 'in_progress':
        return 'En cours';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  return (
    <Badge variant={getVariant()}>{getLabel()}</Badge>
  );
};

export default StatusBadge;
