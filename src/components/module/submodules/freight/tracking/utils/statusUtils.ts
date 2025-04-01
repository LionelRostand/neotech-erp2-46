
import { PackageStatus } from '@/types/freight';

// Get appropriate color class for package status
export const getStatusColor = (status: PackageStatus): string => {
  switch (status) {
    case 'delivered':
      return 'bg-green-500';
    case 'in_transit':
      return 'bg-blue-500';
    case 'processing':
      return 'bg-amber-500';
    case 'registered':
      return 'bg-purple-500';
    case 'out_for_delivery':
      return 'bg-cyan-500';
    case 'delayed':
      return 'bg-orange-500';
    case 'exception':
      return 'bg-red-500';
    case 'returned':
      return 'bg-gray-500';
    default:
      return 'bg-gray-400';
  }
};

// Format package status for display
export const formatPackageStatus = (status: PackageStatus): string => {
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
    default:
      return 'Statut inconnu';
  }
};

// Generate HTML for tracking marker based on status
export const getTrackingMarkerHtml = (status: PackageStatus): string => {
  const color = getStatusColor(status);
  
  return `<div class="w-8 h-8 rounded-full bg-white p-1 shadow-md flex items-center justify-center">
    <div class="w-6 h-6 rounded-full ${color}"></div>
  </div>`;
};
