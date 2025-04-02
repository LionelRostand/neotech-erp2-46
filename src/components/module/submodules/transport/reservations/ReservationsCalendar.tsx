import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, MapPin, User } from "lucide-react";
import { Reservation } from '../types';
import ViewReservationDialog from './ViewReservationDialog';
import { getAddressString } from '../types/reservation-types';

// Mock data for reservations
const mockReservations: Partial<Reservation>[] = [
  {
    id: "res001",
    clientName: "Marie Dupont",
    startDate: "2023-11-10", 
    endDate: "2023-11-12",
    pickupLocation: { address: "15 Rue de la Paix, Paris" },
    dropoffLocation: { address: "Charles de Gaulle Airport, Terminal 2E" },
    totalAmount: 320,
    status: "confirmed",
    paymentStatus: "paid",
    notes: "Client VIP, préférence siège avant",
    pickup: "15 Rue de la Paix, Paris",
    dropoff: "Charles de Gaulle Airport, Terminal 2E"
  },
  {
    id: "res002",
    clientName: "Pierre Dubois",
    startDate: "2023-11-15",
    endDate: "2023-11-15",
    pickupLocation: { address: "Aéroport CDG Terminal 2E, Paris" },
    dropoffLocation: { address: "25 rue du Faubourg Saint-Honoré, 75008 Paris" },
    status: "pending",
    paymentStatus: "unpaid",
    notes: "Location sans chauffeur",
    pickup: "Aéroport CDG Terminal 2E, Paris",
    dropoff: "25 rue du Faubourg Saint-Honoré, 75008 Paris",
    totalAmount: 120
  },
  {
    id: "res003",
    clientName: "Sophie Laurent",
    startDate: "2023-11-08",
    endDate: "2023-11-10",
    pickupLocation: { address: "Gare de Lyon, Paris" },
    dropoffLocation: { address: "Gare de Lyon, Paris" },
    status: "completed",
    paymentStatus: "paid",
    notes: "Location sans chauffeur",
    pickup: "Gare de Lyon, Paris",
    dropoff: "Gare de Lyon, Paris",
    totalAmount: 320
  },
  {
    id: "res004",
    clientName: "Jean Moreau",
    startDate: "2023-11-20",
    endDate: "2023-11-20",
    pickupLocation: { address: "Hôtel Ritz, Place Vendôme, Paris" },
    dropoffLocation: { address: "Opéra Garnier, Paris" },
    status: "confirmed",
    paymentStatus: "partial",
    notes: "Location sans chauffeur",
    pickup: "Hôtel Ritz, Place Vendôme, Paris",
    dropoff: "Opéra Garnier, Paris",
    totalAmount: 180
  },
  {
    id: "res005",
    clientName: "Isabelle Bernard",
    startDate: "2023-11-25",
    endDate: "2023-11-27",
    pickupLocation: { address: "Gare Montparnasse, Paris" },
    dropoffLocation: { address: "Gare Montparnasse, Paris" },
    status: "pending",
    paymentStatus: "unpaid",
    notes: "Location sans chauffeur",
    pickup: "Gare Montparnasse, Paris",
    dropoff: "Gare Montparnasse, Paris",
    totalAmount: 420
  }
];

const ReservationsCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeTab, setActiveTab] = useState("calendar");
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Filter reservations for the selected date
  const selectedDateReservations = mockReservations.filter(reservation => {
    if (!reservation.startDate) return false;
    const reservationDate = new Date(reservation.startDate);
    return (
      date &&
      reservationDate.getFullYear() === date.getFullYear() &&
      reservationDate.getMonth() === date.getMonth() &&
      reservationDate.getDate() === date.getDate()
    );
  });

  // Extract notes for the selected date
  const selectedDateNotes = selectedDateReservations.map(reservation => reservation.notes) || [];

  // Extract pickup locations for the selected date
  const selectedDatePickups = selectedDateReservations.map(reservation => reservation.pickupLocation?.address) || [];

  // Extract dropoff locations for the selected date
  const selectedDateDropoffs = selectedDateReservations.map(reservation => reservation.dropoffLocation?.address) || [];

  const handleViewDetailsClick = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsViewDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardContent className="grid gap-4">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
              <TabsTrigger value="details">Détails du jour</TabsTrigger>
            </TabsList>
            <div className="grid gap-4">
              <Tabs.Content value="calendar" className="focus:outline-none">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </Tabs.Content>
              <Tabs.Content value="details" className="focus:outline-none space-y-4">
                <h2 className="text-lg font-semibold">
                  Réservations du {date ? date.toLocaleDateString() : "sélectionnez une date"}
                </h2>
                {selectedDateReservations.length === 0 ? (
                  <p>Aucune réservation pour cette date.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateReservations.map((reservation) => (
                      <div key={reservation.id} className="border rounded-md p-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-md font-semibold">
                            {reservation.clientName}
                          </h3>
                          <div>
                            <Button size="sm" onClick={() => handleViewDetailsClick(reservation as Reservation)}>
                              Voir détails
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {reservation.startDate && new Date(reservation.startDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {reservation.startDate && new Date(reservation.startDate).toLocaleTimeString()}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {reservation.pickupLocation && getAddressString(reservation.pickupLocation)}
                          </div>
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {reservation.notes}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Tabs.Content>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* View Reservation Dialog */}
      {selectedReservation && (
        <ViewReservationDialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
          reservation={selectedReservation}
        />
      )}
    </>
  );
};

export default ReservationsCalendar;
