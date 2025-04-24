
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
    
    const positiveStatuses = ['completed', 'success', 'paid', 'active', 'approved', 'Terminée', 'Actif'];
    const warningStatuses = ['in_progress', 'pending', 'partial', 'scheduled', 'En cours', 'Planifiée'];
    const dangerStatuses = ['cancelled', 'failed', 'overdue', 'inactive', 'rejected', 'Annulée', 'Inactif'];
    
    if (positiveStatuses.some(s => status.toLowerCase().includes(s.toLowerCase()))) {
      return 'success' as const;
    }
    
    if (warningStatuses.some(s => status.toLowerCase().includes(s.toLowerCase()))) {
      return 'warning' as const;
    }
    
    if (dangerStatuses.some(s => status.toLowerCase().includes(s.toLowerCase()))) {
      return 'danger' as const;
    }
    
    return 'outline' as const;
  };

  const getLabel = () => {
    if (children) return children;
    if (label) return label;
    
    const statusMap: Record<string, string> = {
      'scheduled': 'Planifiée',
      'in_progress': 'En cours',
      'completed': 'Terminée',
      'cancelled': 'Annulée',
      'active': 'Actif',
      'inactive': 'Inactif',
      'pending': 'En attente',
      'paid': 'Payé',
      'unpaid': 'Non payé',
      'partial': 'Partiel',
      'overdue': 'En retard'
    };
    
    return statusMap[status.toLowerCase()] || status;
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
