
import React from 'react';
import { ChevronsUpDown } from 'lucide-react';

// Export components used across the transport module
export { ChevronsUpDown };

// Add any other UI utilities here
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price);
};
