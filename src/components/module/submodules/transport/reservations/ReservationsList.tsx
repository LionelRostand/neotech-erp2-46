
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reservation } from '../types/reservation-types';
import EditReservationDialog from './EditReservationDialog';
import ViewReservationDetailsDialog from './ViewReservationDetailsDialog';

// Mock data pour les réservations
const mockReservations: Reservation[] = [
  {
    id: "rsv-001",
    vehicleId: "veh-001",
    driverId: "drv-001",
    clientId: "cli-001",
    clientName: "Marie Martin",
    startDate: "2023-11-10",
    endDate: "2023-11-12",
    pickupLocation: "15 rue de Rivoli, 75001 Paris",
    dropoffLocation: "8 avenue des Champs-Élysées, 75008 Paris",
    status: "confirmed",
    paymentStatus: "paid",
    totalAmount: 250,
    notes: "Client VIP, prévoir eau minérale",
    createdAt: "2023-10-25T14:30:00",
    updatedAt: "2023-10-25T14:30:00"
  },
  {
    id: "rsv-002",
    vehicleId: "veh-002",
    driverId: "drv-002",
    clientId: "cli-002",
    clientName: "Pierre Dubois",
    startDate: "2023-11-15",
    endDate: "2023-11-15",
    pickupLocation: "Aéroport CDG Terminal 2E, Paris",
    dropoffLocation: "25 rue du Faubourg Saint-Honoré, 75008 Paris",
    status: "pending",
    paymentStatus: "pending",
    totalAmount: 120,
    notes: "",
    createdAt: "2023-11-01T09:45:00",
    updatedAt: "2023-11-01T09:45:00"
  },
  {
    id: "rsv-003",
    vehicleId: "veh-003",
    clientId: "cli-003",
    clientName: "Sophie Laurent",
    startDate: "2023-11-08",
    endDate: "2023-11-10",
    pickupLocation: "Gare de Lyon, Paris",
    dropoffLocation: "Gare de Lyon, Paris",
    status: "completed",
    paymentStatus: "paid",
    totalAmount: 320,
    notes: "Location sans chauffeur",
    createdAt: "2023-10-20T11:15:00",
    updatedAt: "2023-11-10T18:30:00"
  },
  {
    id: "rsv-004",
    vehicleId: "veh-001",
    driverId: "drv-003",
    clientId: "cli-004",
    clientName: "Jean Moreau",
    startDate: "2023-11-20",
    endDate: "2023-11-20",
    pickupLocation: "Hôtel Ritz, Place Vendôme, Paris",
    dropoffLocation: "Opéra Garnier, Paris",
    status: "confirmed",
    paymentStatus: "partial",
    totalAmount: 180,
    notes: "",
    createdAt: "2023-11-05T16:20:00",
    updatedAt: "2023-11-05T16:20:00"
  },
  {
    id: "rsv-005",
    vehicleId: "veh-004",
    clientId: "cli-005",
    clientName: "Isabelle Bernard",
    startDate: "2023-11-25",
    endDate: "2023-11-27",
    pickupLocation: "Gare Montparnasse, Paris",
    dropoffLocation: "Gare Montparnasse, Paris",
    status: "pending",
    paymentStatus: "pending",
    totalAmount: 420,
    notes: "Location sans chauffeur, kilométrage illimité",
    createdAt: "2023-11-07T10:10:00",
    updatedAt: "2023-11-07T10:10:00"
  }
];

const ReservationsList: React.FC = () => {
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Format date string
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Get badge based on reservation status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Terminée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };
  
  // Get badge based on payment status
  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Payée</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Partielle</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">En attente</Badge>;
      default:
        return <Badge variant="outline">Inconnue</Badge>;
    }
  };

  const handleEditClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsEditDialogOpen(true);
  };

  const handleViewDetailsClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsDialogOpen(true);
  };

  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Date début</TableHead>
              <TableHead>Date fin</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Paiement</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className="font-medium">{reservation.id}</TableCell>
                <TableCell>{reservation.clientName}</TableCell>
                <TableCell>{formatDate(reservation.startDate)}</TableCell>
                <TableCell>{formatDate(reservation.endDate)}</TableCell>
                <TableCell>{reservation.totalAmount} €</TableCell>
                <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell>{getPaymentBadge(reservation.paymentStatus)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditClick(reservation)}
                    >
                      Modifier
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewDetailsClick(reservation)}
                    >
                      Détails
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {selectedReservation && (
        <>
          <EditReservationDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            reservation={selectedReservation}
          />
          <ViewReservationDetailsDialog
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
            reservation={selectedReservation}
          />
        </>
      )}
    </>
  );
};

export default ReservationsList;
