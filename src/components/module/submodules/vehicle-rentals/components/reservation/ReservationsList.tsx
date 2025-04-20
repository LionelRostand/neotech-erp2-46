
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Reservation } from '../../types/rental-types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';

const ReservationsList = () => {
  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['rentals', 'reservations'],
    queryFn: () => fetchCollectionData<Reservation>(COLLECTIONS.TRANSPORT.RESERVATIONS)
  });

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Chargement des réservations...</div>;
  }

  const getStatusBadge = (status: Reservation['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmée</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Terminée</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Véhicule</TableHead>
          <TableHead>Date de début</TableHead>
          <TableHead>Date de fin</TableHead>
          <TableHead>Montant</TableHead>
          <TableHead>Statut</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reservations.map((reservation) => (
          <TableRow key={reservation.id}>
            <TableCell>{reservation.clientName}</TableCell>
            <TableCell>{reservation.vehicleId}</TableCell>
            <TableCell>
              {format(new Date(reservation.startDate), 'PPP', { locale: fr })}
            </TableCell>
            <TableCell>
              {format(new Date(reservation.endDate), 'PPP', { locale: fr })}
            </TableCell>
            <TableCell>{reservation.totalAmount} €</TableCell>
            <TableCell>{getStatusBadge(reservation.status)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReservationsList;
