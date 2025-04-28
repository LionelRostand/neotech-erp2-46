
import React from 'react';
import { Badge } from '@/components/ui/badge';

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

  // Map our custom variants to Badge's accepted variants
  const badgeVariantMapping = {
    outline: 'outline' as const,
    success: 'outline' as const,  // Use outline but apply success classes
    warning: 'outline' as const,  // Use outline but apply warning classes
    danger: 'outline' as const,   // Use outline but apply danger classes
  };

  // Apply custom classes based on our variant
  const variantClassMapping = {
    outline: '',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
  };

  const variant = getVariant();
  const badgeVariant = badgeVariantMapping[variant];
  const variantClasses = variantClassMapping[variant];

  return (
    <Badge variant={badgeVariant} className={variantClasses}>
      {getLabel()}
    </Badge>
  );
};

export default StatusBadge;
