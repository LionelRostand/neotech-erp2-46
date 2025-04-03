// ReservationsList.tsx
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { TransportReservation, Reservation } from '../types';

interface ReservationsListProps {
  reservations: (TransportReservation | Reservation)[];
  onViewDetails: (reservation: TransportReservation | Reservation) => void;
}

const ReservationsList: React.FC<ReservationsListProps> = ({ reservations, onViewDetails }) => {

  // Mock data for demonstration purposes
  const mockReservations: Reservation[] = [
    {
      id: "res1",
      clientId: "client1",
      clientName: "Acme Corporation",
      vehicleId: "vehicle1",
      driverId: "driver1",
      startDate: "2023-08-15",
      endDate: "2023-08-16",
      status: "confirmed",
      pickupLocation: "123 Main St, Paris",
      dropoffLocation: "456 Elm St, Paris",
      totalAmount: 250,
      paymentStatus: "paid",
      createdAt: "2023-08-10",
      notes: ["Client requested water bottles"]
    },
    {
      id: "res2",
      clientId: "client2",
      clientName: "Beta Industries",
      vehicleId: "vehicle2",
      driverId: "driver2",
      startDate: "2023-08-20",
      endDate: "2023-08-21",
      status: "pending",
      pickupLocation: "789 Oak St, London",
      dropoffLocation: "101 Pine St, London",
      totalAmount: 300,
      paymentStatus: "pending",
      createdAt: "2023-08-12",
      notes: ["Waiting for client confirmation"]
    },
  ];

  // Mock transport reservations should use the correct structure
  const mockTransportReservations: TransportReservation[] = [
    {
      id: "tres1",
      clientId: "client1",
      clientName: "Acme Corporation",
      vehicleId: "vehicle1",
      vehicleName: "Mercedes Sprinter",
      driverId: "driver1",
      driverName: "Jean Dupont",
      status: "confirmed",
      date: "2023-08-15",
      time: "09:00",
      pickup: { address: "123 Main St, Paris", datetime: "2023-08-15T09:00:00" },
      dropoff: { address: "456 Elm St, Paris", datetime: "2023-08-15T17:00:00" },
      service: "airport",
      amount: 250,
      price: 250,
      paymentStatus: "paid",
      isPaid: true,
      needsDriver: true,
      contractGenerated: true,
      createdAt: "2023-08-10",
      notes: ["Client requested water bottles"]
    },
    {
      id: "tres2",
      clientId: "client2",
      clientName: "Beta Industries",
      vehicleId: "vehicle2",
      vehicleName: "BMW X5",
      driverId: "driver2",
      driverName: "Marie Martin",
      status: "pending",
      date: "2023-08-20",
      time: "14:00",
      pickup: { address: "789 Oak St, London", datetime: "2023-08-20T14:00:00" },
      dropoff: { address: "101 Pine St, London", datetime: "2023-08-20T22:00:00" },
      service: "business",
      amount: 300,
      price: 300,
      paymentStatus: "pending",
      isPaid: false,
      needsDriver: true,
      contractGenerated: false,
      createdAt: "2023-08-12",
      notes: ["Waiting for client confirmation"]
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockReservations.map((reservation) => (
          <TableRow key={reservation.id}>
            <TableCell>{reservation.id}</TableCell>
            <TableCell>{reservation.clientName}</TableCell>
            <TableCell>{reservation.startDate}</TableCell>
            <TableCell>{reservation.status}</TableCell>
            <TableCell>
              <button onClick={() => onViewDetails(reservation)}>View Details</button>
            </TableCell>
          </TableRow>
        ))}
        {mockTransportReservations.map((reservation) => (
          <TableRow key={reservation.id}>
            <TableCell>{reservation.id}</TableCell>
            <TableCell>{reservation.clientName}</TableCell>
            <TableCell>{reservation.date}</TableCell>
            <TableCell>{reservation.status}</TableCell>
            <TableCell>
              <button onClick={() => onViewDetails(reservation)}>View Details</button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ReservationsList;
