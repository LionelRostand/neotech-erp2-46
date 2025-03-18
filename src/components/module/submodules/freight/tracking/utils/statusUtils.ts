
/**
 * Utilities for handling package statuses and formatting
 */

// Helper function to format package status for display
export const formatPackageStatus = (status: string): string => {
  switch (status) {
    case 'registered': return 'Enregistré';
    case 'processing': return 'En traitement';
    case 'in_transit': return 'En transit';
    case 'out_for_delivery': return 'En cours de livraison';
    case 'delivered': return 'Livré';
    case 'delayed': return 'Retardé';
    case 'exception': return 'Problème';
    case 'returned': return 'Retourné';
    case 'lost': return 'Perdu';
    case 'draft': return 'Brouillon';
    case 'ready': return 'Prêt';
    case 'shipped': return 'Expédié';
    default: return status;
  }
};

// Helper function to get status color
export const getStatusColor = (status: string): "success" | "warning" | "danger" => {
  switch (status) {
    case 'delivered':
      return 'success';
    case 'in_transit':
    case 'processing':
    case 'registered':
    case 'out_for_delivery':
    case 'shipped':
    case 'ready':
      return 'warning';
    case 'delayed':
    case 'exception':
    case 'returned':
    case 'lost':
    case 'draft':
    default:
      return 'danger';
  }
};
