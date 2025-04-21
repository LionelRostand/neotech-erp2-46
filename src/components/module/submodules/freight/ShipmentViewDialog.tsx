
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shipment } from '@/types/freight';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { FileText, Package, Truck } from 'lucide-react';

interface ShipmentViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment;
}

const ShipmentViewDialog: React.FC<ShipmentViewDialogProps> = ({ isOpen, onClose, shipment }) => {
  // Helper function to safely format dates, returning a fallback message for invalid dates
  const formatDateSafely = (dateString: string | undefined, formatStr: string = 'dd MMMM yyyy', fallback: string = 'Non défini') => {
    if (!dateString) return fallback;
    
    try {
      const date = new Date(dateString);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return fallback;
      }
      return format(date, formatStr, { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', dateString, error);
      return fallback;
    }
  };

  // Fonction pour rendre le statut avec le bon style
  const renderStatus = (status: string) => {
    let color = "";
    let label = "";
    
    switch(status) {
      case 'draft':
        color = "bg-gray-400";
        label = "Brouillon";
        break;
      case 'confirmed':
        color = "bg-blue-500";
        label = "Confirmée";
        break;
      case 'in_transit':
        color = "bg-amber-500";
        label = "En transit";
        break;
      case 'delivered':
        color = "bg-green-500";
        label = "Livrée";
        break;
      case 'cancelled':
        color = "bg-red-500";
        label = "Annulée";
        break;
      case 'delayed':
        color = "bg-purple-500";
        label = "Retardée";
        break;
      default:
        color = "bg-gray-400";
        label = status;
    }
    
    return <Badge className={`${color} text-white`}>{label}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Expédition {shipment.reference}</DialogTitle>
          <DialogDescription>
            Créée le {formatDateSafely(shipment.createdAt)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Client</h3>
            <p className="mt-1">{shipment.customer}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Statut</h3>
            <div className="mt-1">{renderStatus(shipment.status)}</div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Origine</h3>
            <p className="mt-1">{shipment.origin}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Destination</h3>
            <p className="mt-1">{shipment.destination}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Transporteur</h3>
            <p className="mt-1">{shipment.carrierName}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Type d'expédition</h3>
            <p className="mt-1">{shipment.shipmentType}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date prévue</h3>
            <p className="mt-1">{formatDateSafely(shipment.scheduledDate, 'dd MMM yyyy')}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Livraison estimée</h3>
            <p className="mt-1">{formatDateSafely(shipment.estimatedDeliveryDate, 'dd MMM yyyy')}</p>
          </div>
          
          {shipment.actualDeliveryDate && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Livraison effectuée</h3>
              <p className="mt-1">{formatDateSafely(shipment.actualDeliveryDate, 'dd MMM yyyy')}</p>
            </div>
          )}
          
          {shipment.trackingNumber && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Numéro de suivi</h3>
              <p className="mt-1">{shipment.trackingNumber}</p>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Articles ({shipment.lines?.length || 0})</h3>
          {shipment.lines && shipment.lines.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Article</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qté</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poids</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shipment.lines.map((line) => (
                    <tr key={line.id}>
                      <td className="px-4 py-2 text-sm text-gray-900">{line.productName}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{line.quantity}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">{line.weight} kg</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Aucun article dans cette expédition</p>
          )}
        </div>
        
        {shipment.notes && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Notes</h3>
            <p className="text-sm text-gray-500">{shipment.notes}</p>
          </div>
        )}
        
        <div className="mt-4 flex justify-between">
          <div>
            <span className="text-sm font-medium text-gray-500">Poids total: </span>
            <span className="text-sm">{shipment.totalWeight} kg</span>
          </div>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentViewDialog;
