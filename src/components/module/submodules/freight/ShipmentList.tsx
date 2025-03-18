
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import StatusBadge from '@/components/StatusBadge';
import { Shipment } from '@/types/freight';
import { mockShipments } from './mockData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Eye, FileEdit, Trash2 } from 'lucide-react';

interface ShipmentListProps {
  filter: 'all' | 'ongoing' | 'delivered' | 'delayed';
}

const ShipmentList: React.FC<ShipmentListProps> = ({ filter }) => {
  const getStatusColor = (status: string): "default" | "success" | "warning" | "danger" => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'in_transit':
      case 'confirmed':
        return 'warning';
      case 'delayed':
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'draft': return 'Brouillon';
      case 'confirmed': return 'Confirmée';
      case 'in_transit': return 'En transit';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      case 'delayed': return 'Retardée';
      default: return status;
    }
  };

  // Filter shipments based on the selected filter
  const filteredShipments = mockShipments.filter(shipment => {
    if (filter === 'all') return true;
    if (filter === 'ongoing') return ['confirmed', 'in_transit'].includes(shipment.status);
    if (filter === 'delivered') return shipment.status === 'delivered';
    if (filter === 'delayed') return shipment.status === 'delayed';
    return true;
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Origine</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Transporteur</TableHead>
            <TableHead>Date prévue</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredShipments.length > 0 ? (
            filteredShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">{shipment.reference}</TableCell>
                <TableCell>{shipment.customer}</TableCell>
                <TableCell>{shipment.origin}</TableCell>
                <TableCell>{shipment.destination}</TableCell>
                <TableCell>{shipment.carrierName}</TableCell>
                <TableCell>
                  {format(new Date(shipment.scheduledDate), 'dd MMM yyyy', { locale: fr })}
                </TableCell>
                <TableCell>
                  <StatusBadge status={getStatusColor(shipment.status)}>
                    {getStatusText(shipment.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <FileEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                Aucune expédition trouvée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShipmentList;
