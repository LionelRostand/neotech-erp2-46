
import React from 'react';
import { PaymentStatus } from '../../types/freight-types';

const STATUS_COLORS: Record<PaymentStatus, string> = {
  'completed': 'bg-green-100 text-green-800',
  'pending': 'bg-yellow-100 text-yellow-800',
  'failed': 'bg-red-100 text-red-800',
  'refunded': 'bg-blue-100 text-blue-800',
  'cancelled': 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS: Record<PaymentStatus, string> = {
  'completed': 'Terminé',
  'pending': 'En attente',
  'failed': 'Échoué',
  'refunded': 'Remboursé',
  'cancelled': 'Annulé',
};

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
}

const PaymentStatusBadge: React.FC<PaymentStatusBadgeProps> = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  const label = STATUS_LABELS[status] || status;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

export default PaymentStatusBadge;
