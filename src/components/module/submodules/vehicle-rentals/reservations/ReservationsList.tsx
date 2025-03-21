
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Eye, Search, Trash2 } from "lucide-react";
import { Reservation, ReservationStatus } from '../types/rental-types';
import ViewReservationDialog from './ViewReservationDialog';
import EditReservationDialog from './EditReservationDialog';
import DeleteReservationDialog from './DeleteReservationDialog';

// Mock data for reservations
const mockReservations: Reservation[] = [
  {
    id: "res-001",
    vehicleId: "veh-001",
    clientId: "cli-001",
    startDate: "2024-03-22",
    endDate: "2024-03-25",
    status: "confirmed",
    pickupLocationId: "loc-001",
    returnLocationId: "loc-001",
    totalPrice: 240,
    depositAmount: 500,
    depositPaid: true,
    notes: "Client régulier",
    createdAt: "2024-03-10",
    updatedAt: "2024-03-10"
  },
  {
    id: "res-002",
    vehicleId: "veh-003",
    clientId: "cli-002",
    startDate: "2024-03-24",
    endDate: "2024-03-29",
    status: "in-progress",
    pickupLocationId: "loc-002",
    returnLocationId: "loc-002",
    totalPrice: 400,
    depositAmount: 600,
    depositPaid: true,
    createdAt: "2024-03-12",
    updatedAt: "2024-03-15"
  },
  {
    id: "res-003",
    vehicleId: "veh-005",
    clientId: "cli-003",
    startDate: "2024-03-29",
    endDate: "2024-04-05",
    status: "pending",
    pickupLocationId: "loc-001",
    returnLocationId: "loc-003",
    totalPrice: 560,
    depositAmount: 700,
    depositPaid: false,
    notes: "En attente de paiement",
    createdAt: "2024-03-15",
    updatedAt: "2024-03-15"
  },
  {
    id: "res-004",
    vehicleId: "veh-002",
    clientId: "cli-004",
    startDate: "2024-03-18",
    endDate: "2024-03-21",
    status: "completed",
    pickupLocationId: "loc-002",
    returnLocationId: "loc-002",
    totalPrice: 280,
    depositAmount: 500,
    depositPaid: true,
    createdAt: "2024-03-01",
    updatedAt: "2024-03-21"
  },
  {
    id: "res-005",
    vehicleId: "veh-004",
    clientId: "cli-001",
    startDate: "2024-04-01",
    endDate: "2024-04-07",
    status: "confirmed",
    pickupLocationId: "loc-003",
    returnLocationId: "loc-003",
    totalPrice: 490,
    depositAmount: 600,
    depositPaid: true,
    createdAt: "2024-03-17",
    updatedAt: "2024-03-17"
  }
];

// Mock vehicle and client names for display
const mockVehicleNames: Record<string, string> = {
  "veh-001": "Renault Clio",
  "veh-002": "Peugeot 308",
  "veh-003": "Toyota Corolla",
  "veh-004": "Audi A3",
  "veh-005": "Mercedes Classe C"
};

const mockClientNames: Record<string, string> = {
  "cli-001": "Jean Dupont",
  "cli-002": "Marie Martin",
  "cli-003": "Paul Bernard",
  "cli-004": "Sophie Dubois"
};

// Status badges
const getStatusBadge = (status: ReservationStatus) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-500">Confirmée</Badge>;
    case "in-progress":
      return <Badge className="bg-blue-500">En cours</Badge>;
    case "completed":
      return <Badge className="bg-gray-500">Terminée</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500">Annulée</Badge>;
    case "pending":
      return <Badge className="bg-yellow-500">En attente</Badge>;
    default:
      return <Badge>Inconnue</Badge>;
  }
};

const ReservationsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Filter reservations based on search term
  const filteredReservations = mockReservations.filter(
    (reservation) =>
      mockVehicleNames[reservation.vehicleId]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mockClientNames[reservation.clientId]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setViewDialogOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setEditDialogOpen(true);
  };

  const handleDeleteReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une réservation..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Aucune réservation trouvée
                </TableCell>
              </TableRow>
            ) : (
              filteredReservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium">{reservation.id}</TableCell>
                  <TableCell>{mockClientNames[reservation.clientId]}</TableCell>
                  <TableCell>{mockVehicleNames[reservation.vehicleId]}</TableCell>
                  <TableCell>
                    {new Date(reservation.startDate).toLocaleDateString()} - 
                    {new Date(reservation.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{reservation.totalPrice} €</TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewReservation(reservation)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditReservation(reservation)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteReservation(reservation)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedReservation && (
        <>
          <ViewReservationDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            reservation={selectedReservation}
            vehicleName={mockVehicleNames[selectedReservation.vehicleId]}
            clientName={mockClientNames[selectedReservation.clientId]}
          />
          <EditReservationDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            reservation={selectedReservation}
          />
          <DeleteReservationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            reservation={selectedReservation}
          />
        </>
      )}
    </div>
  );
};

export default ReservationsList;
