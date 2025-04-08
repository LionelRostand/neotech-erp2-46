
import { PackageStatus } from '@/types/freight';

export function formatPackageStatus(status: string): string {
  const statusLabels: Record<string, string> = {
    registered: 'Enregistré',
    processing: 'En traitement',
    in_transit: 'En transit',
    out_for_delivery: 'En cours de livraison',
    delivered: 'Livré',
    delayed: 'Retardé',
    exception: 'Problème',
    returned: 'Retourné',
    lost: 'Perdu',
    ready: 'Prêt',
    shipped: 'Expédié',
    draft: 'Brouillon'
  };
  
  return statusLabels[status] || status;
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    delivered: 'bg-green-500',
    in_transit: 'bg-blue-500',
    processing: 'bg-violet-500',
    registered: 'bg-slate-500',
    out_for_delivery: 'bg-teal-500',
    delayed: 'bg-amber-500',
    exception: 'bg-red-500',
    returned: 'bg-red-500',
    lost: 'bg-gray-500',
    ready: 'bg-purple-500',
    shipped: 'bg-blue-500',
    draft: 'bg-gray-500'
  };

  return statusColors[status] || 'bg-slate-500';
}

export function getTrackingMarkerHtml(status: PackageStatus): string {
  const color = getStatusColor(status).replace('bg-', '');
  
  return `
    <div class="tracking-marker ${color}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package">
        <path d="m12.89 1.45 8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0Z"></path>
        <path d="M2.32 6.16 12 11l9.68-4.84"></path>
        <path d="M12 22.76V11"></path>
      </svg>
    </div>
  `;
}
