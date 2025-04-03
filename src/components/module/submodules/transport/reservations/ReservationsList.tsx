
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { TransportReservation } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ReservationsListProps {
  reservations: TransportReservation[];
  onViewDetails: (reservation: TransportReservation) => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'confirmed':
      return <Badge className="bg-green-500">Confirmée</Badge>;
    case 'pending':
      return <Badge className="bg-yellow-500">En attente</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-500">Annulée</Badge>;
    case 'completed':
      return <Badge className="bg-blue-500">Terminée</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

const ReservationsList: React.FC<ReservationsListProps> = ({ reservations, onViewDetails }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PP', { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Référence</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Véhicule</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Paiement</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell className="font-medium">{reservation.id}</TableCell>
              <TableCell>{reservation.clientName}</TableCell>
              <TableCell>{formatDate(reservation.date)}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {typeof reservation.dropoff === 'string' ? reservation.dropoff : reservation.dropoff.address}
              </TableCell>
              <TableCell>{reservation.vehicleName}</TableCell>
              <TableCell>{getStatusBadge(reservation.status)}</TableCell>
              <TableCell>
                <Badge variant={reservation.isPaid ? "outline" : "secondary"}>
                  {reservation.isPaid ? "Payée" : "En attente"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewDetails(reservation)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Détails
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {reservations.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                Aucune réservation trouvée
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReservationsList;
