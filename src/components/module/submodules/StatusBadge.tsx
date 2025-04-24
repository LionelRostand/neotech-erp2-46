
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface StatusBadgeProps {
  status: string;
  label?: string;
  variant?: 'outline' | 'success' | 'warning' | 'danger';
  children?: React.ReactNode;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label, variant: propVariant, children }) => {
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
    if (children) return children;
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

  // Map custom variants to supported Badge variants
  const mapVariantToBadgeVariant = (variant: string) => {
    switch (variant) {
      case 'success': return 'secondary';
      case 'warning': return 'outline';
      case 'danger': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <Badge 
      variant={mapVariantToBadgeVariant(getVariant())}
      className={cn(
        getVariant() === 'success' && "bg-green-500 hover:bg-green-600",
        getVariant() === 'warning' && "bg-yellow-500 text-black hover:bg-yellow-600",
        getVariant() === 'danger' && "bg-red-500 hover:bg-red-600",
      )}
    >
      {getLabel()}
    </Badge>
  );
};

export default StatusBadge;
