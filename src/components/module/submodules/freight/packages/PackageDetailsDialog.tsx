
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import StatusBadge from '@/components/StatusBadge';
import type { Shipment } from '@/types/freight';

interface PackageDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  packageData: Shipment;
}

const PackageDetailsDialog: React.FC<PackageDetailsDialogProps> = ({
  open,
  onOpenChange,
  packageData,
}) => {
  // Determine status badge type
  const getStatusInfo = (status: string): { type: "success" | "warning" | "danger", text: string } => {
    switch (status) {
      case 'delivered':
        return { type: 'success', text: 'Livré' };
      case 'in_transit':
        return { type: 'warning', text: 'Expédié' };
      case 'confirmed':
        return { type: 'warning', text: 'Prêt' };
      case 'draft':
        return { type: 'danger', text: 'Brouillon' };
      case 'cancelled':
        return { type: 'danger', text: 'Annulé' };
      case 'delayed':
        return { type: 'danger', text: 'Retardé' };
      default:
        return { type: 'danger', text: status };
    }
  };

  // Helper function to safely format dates
  const safeFormatDate = (dateString: string | undefined): string => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateString);
        return '-';
      }
      return format(date, 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return '-';
    }
  };

  const statusInfo = getStatusInfo(packageData.status);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails du colis {packageData.reference}</span>
            <StatusBadge status={statusInfo.type}>
              {statusInfo.text}
            </StatusBadge>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Référence</h3>
              <p className="mt-1 text-sm">{packageData.reference}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Client</h3>
              <p className="mt-1 text-sm">{packageData.customer || '-'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Origine</h3>
              <p className="mt-1 text-sm">{packageData.origin || '-'}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Destination</h3>
              <p className="mt-1 text-sm">{packageData.destination || '-'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Transporteur</h3>
              <p className="mt-1 text-sm">{packageData.carrierName || '-'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
              <p className="mt-1 text-sm">{safeFormatDate(packageData.createdAt)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date d'expédition prévue</h3>
              <p className="mt-1 text-sm">{safeFormatDate(packageData.scheduledDate)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date de livraison estimée</h3>
              <p className="mt-1 text-sm">{safeFormatDate(packageData.estimatedDeliveryDate)}</p>
            </div>
            
            {packageData.actualDeliveryDate && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Date de livraison effective</h3>
                <p className="mt-1 text-sm">{safeFormatDate(packageData.actualDeliveryDate)}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">N° de suivi</h3>
              <p className="mt-1 text-sm font-medium text-blue-600">
                {packageData.trackingNumber || '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-md font-medium">Articles</h3>
          <div className="mt-2 border rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Désignation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Poids
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packageData.lines && packageData.lines.length > 0 ? (
                  packageData.lines.map((line, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {line.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {line.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {line.weight} kg
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={3}>
                      Aucun article
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-500">Poids total:</span>
            <span className="text-sm font-medium">{packageData.totalWeight} kg</span>
          </div>
          
          {packageData.totalPrice && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm font-medium text-gray-500">Coût total:</span>
              <span className="text-sm font-medium">{packageData.totalPrice.toFixed(2)} €</span>
            </div>
          )}
        </div>

        {packageData.notes && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500">Notes</h3>
            <p className="mt-1 text-sm">{packageData.notes}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PackageDetailsDialog;
