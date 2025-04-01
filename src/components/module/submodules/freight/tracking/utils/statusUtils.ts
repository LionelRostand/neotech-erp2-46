
import { PackageStatus } from '@/types/freight';

// Get appropriate color class for package status
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'delivered':
      return 'success'; // Changed to match StatusType
    case 'in_transit':
      return 'warning'; // Changed to match StatusType
    case 'processing':
      return 'warning';
    case 'registered':
      return 'warning';
    case 'out_for_delivery':
      return 'warning';
    case 'delayed':
      return 'warning';
    case 'exception':
      return 'danger'; // Changed to match StatusType
    case 'returned':
      return 'warning';
    case 'shipped':
      return 'warning';
    case 'ready':
      return 'success';
    case 'draft':
      return 'warning';
    case 'lost':
      return 'danger';
    default:
      return 'warning';
  }
};

export type StatusType = string;

// Format package status for display
export const formatPackageStatus = (status: string): string => {
  switch (status) {
    case 'delivered':
      return 'Livré';
    case 'in_transit':
      return 'En transit';
    case 'processing':
      return 'En traitement';
    case 'registered':
      return 'Enregistré';
    case 'out_for_delivery':
      return 'En cours de livraison';
    case 'delayed':
      return 'Retardé';
    case 'exception':
      return 'Problème';
    case 'returned':
      return 'Retourné';
    case 'shipped':
      return 'Expédié';
    case 'ready':
      return 'Prêt';
    case 'draft':
      return 'Brouillon';
    case 'lost':
      return 'Perdu';
    default:
      return 'Statut inconnu';
  }
};

// Generate HTML for tracking marker based on status
export const getTrackingMarkerHtml = (status: string): string => {
  const color = getStatusColor(status);
  
  const colorClass = color === 'success' ? 'bg-green-500' :
                    color === 'warning' ? 'bg-amber-500' :
                    color === 'danger' ? 'bg-red-500' :
                    'bg-gray-400';
  
  return `<div class="w-8 h-8 rounded-full bg-white p-1 shadow-md flex items-center justify-center">
    <div class="w-6 h-6 rounded-full ${colorClass}"></div>
  </div>`;
};
