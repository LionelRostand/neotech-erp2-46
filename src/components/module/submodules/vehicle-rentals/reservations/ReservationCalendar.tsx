
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reservation } from '../types/rental-types';
import ViewReservationDialog from './ViewReservationDialog';

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

// Helper function to convert string to date
const stringToDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Style for reservation events in calendar
const getEventColorByStatus = (status: string) => {
  switch (status) {
    case 'confirmed': return 'bg-green-100 border-green-500 text-green-800';
    case 'in-progress': return 'bg-blue-100 border-blue-500 text-blue-800';
    case 'completed': return 'bg-gray-100 border-gray-500 text-gray-800';
    case 'cancelled': return 'bg-red-100 border-red-500 text-red-800';
    case 'pending': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    default: return 'bg-gray-100 border-gray-500 text-gray-800';
  }
};

const ReservationCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  // Filter reservations based on the selected vehicle
  const filteredReservations = selectedVehicle === 'all'
    ? mockReservations
    : mockReservations.filter(res => res.vehicleId === selectedVehicle);

  // Get reservations for the selected day
  const getReservationsForDay = (day: Date) => {
    return filteredReservations.filter(reservation => {
      const startDate = stringToDate(reservation.startDate);
      const endDate = stringToDate(reservation.endDate);
      return day >= startDate && day <= endDate;
    });
  };

  // Render reservation events for the date
  const renderDateContent = (day: Date) => {
    const reservations = getReservationsForDay(day);
    return (
      <div className="relative h-full">
        {reservations.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center">
            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
          </div>
        )}
      </div>
    );
  };

  // Handle day click to show reservations for that day
  const handleDayClick = (day: Date) => {
    const reservations = getReservationsForDay(day);
    if (reservations.length > 0) {
      setSelectedReservation(reservations[0]);
      setViewDialogOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Tous les véhicules" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les véhicules</SelectItem>
            {Object.entries(mockVehicleNames).map(([id, name]) => (
              <SelectItem key={id} value={id}>{name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
        <Card>
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="p-3 pointer-events-auto"
              components={{
                DayContent: ({ date }) => renderDateContent(date),
              }}
              onDayClick={handleDayClick}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Réservations du jour</h3>
            {date && (
              <div className="space-y-3">
                {getReservationsForDay(date).length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aucune réservation pour ce jour</p>
                ) : (
                  getReservationsForDay(date).map(reservation => (
                    <div 
                      key={reservation.id}
                      className={`p-2 rounded border text-sm cursor-pointer ${getEventColorByStatus(reservation.status)}`}
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setViewDialogOpen(true);
                      }}
                    >
                      <div className="font-medium">{mockVehicleNames[reservation.vehicleId]}</div>
                      <div>{mockClientNames[reservation.clientId]}</div>
                      <div className="text-xs">
                        {new Date(reservation.startDate).toLocaleDateString()} - 
                        {new Date(reservation.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedReservation && (
        <ViewReservationDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          reservation={selectedReservation}
          vehicleName={mockVehicleNames[selectedReservation.vehicleId]}
          clientName={mockClientNames[selectedReservation.clientId]}
        />
      )}
    </div>
  );
};

export default ReservationCalendar;
