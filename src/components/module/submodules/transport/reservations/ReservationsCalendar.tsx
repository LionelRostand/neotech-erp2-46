
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Reservation } from '../types/reservation-types';
import ViewReservationDetailsDialog from './ViewReservationDetailsDialog';

// Mock data for reservations
const mockReservations: Reservation[] = [
  {
    id: "rsv-001",
    vehicleId: "veh-001",
    driverId: "drv-001",
    clientId: "cli-001",
    clientName: "Marie Martin",
    startDate: "2023-11-10",
    endDate: "2023-11-12",
    pickupLocation: { address: "15 rue de Rivoli, 75001 Paris" },
    dropoffLocation: { address: "8 avenue des Champs-Élysées, 75008 Paris" },
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
    pickupLocation: { address: "Aéroport CDG Terminal 2E, Paris" },
    dropoffLocation: { address: "25 rue du Faubourg Saint-Honoré, 75008 Paris" },
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
    pickupLocation: { address: "Gare de Lyon, Paris" },
    dropoffLocation: { address: "Gare de Lyon, Paris" },
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
    pickupLocation: { address: "Hôtel Ritz, Place Vendôme, Paris" },
    dropoffLocation: { address: "Opéra Garnier, Paris" },
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
    pickupLocation: { address: "Gare Montparnasse, Paris" },
    dropoffLocation: { address: "Gare Montparnasse, Paris" },
    status: "pending",
    paymentStatus: "pending",
    totalAmount: 420,
    notes: "Location sans chauffeur, kilométrage illimité",
    createdAt: "2023-11-07T10:10:00",
    updatedAt: "2023-11-07T10:10:00"
  }
];

// Adjust dates to be close to current date for demo
const adjustReservationDates = (reservations: Reservation[]): Reservation[] => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  
  return reservations.map((reservation, index) => {
    // Parse original dates
    const startDate = new Date(reservation.startDate);
    const endDate = new Date(reservation.endDate);
    
    // Calculate new dates that are within the current month
    const newStartDate = new Date(currentYear, currentMonth, 5 + index * 3);
    const duration = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const newEndDate = new Date(currentYear, currentMonth, 5 + index * 3 + duration);
    
    return {
      ...reservation,
      startDate: newStartDate.toISOString().split('T')[0],
      endDate: newEndDate.toISOString().split('T')[0],
    };
  });
};

const ReservationsCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  
  // Adjust reservation dates to be around the current date
  const adjustedReservations = adjustReservationDates(mockReservations);
  
  // Get reservations for the selected date
  const getReservationsForDate = (date: Date) => {
    return adjustedReservations.filter(reservation => {
      const start = new Date(reservation.startDate);
      const end = new Date(reservation.endDate);
      return date >= start && date <= end;
    });
  };

  const selectedDateReservations = selectedDate 
    ? getReservationsForDate(selectedDate) 
    : [];

  // Get color for reservation status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Handle view reservation details
  const handleViewDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setIsDetailsDialogOpen(true);
  };

  // Render content for a calendar cell
  const renderCellContent = (day: Date) => {
    const reservationsForDay = getReservationsForDate(day);
    
    if (reservationsForDay.length === 0) return null;
    
    // If we have reservations for this day, show indicators
    return (
      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1">
        {reservationsForDay.slice(0, 3).map((reservation, i) => (
          <div 
            key={i}
            className={`h-1 w-1 rounded-full ${getStatusColor(reservation.status)}`}
          />
        ))}
        {reservationsForDay.length > 3 && (
          <div className="h-1 w-1 rounded-full bg-gray-400" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="month" 
        value={calendarView}
        onValueChange={(v) => setCalendarView(v as 'month' | 'week' | 'day')}
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="month">Mois</TabsTrigger>
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="day">Jour</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = new Date(selectedDate || new Date());
                if (calendarView === 'month') {
                  newDate.setMonth(newDate.getMonth() - 1);
                } else if (calendarView === 'week') {
                  newDate.setDate(newDate.getDate() - 7);
                } else {
                  newDate.setDate(newDate.getDate() - 1);
                }
                setSelectedDate(newDate);
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedDate(new Date())}
            >
              Aujourd'hui
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newDate = new Date(selectedDate || new Date());
                if (calendarView === 'month') {
                  newDate.setMonth(newDate.getMonth() + 1);
                } else if (calendarView === 'week') {
                  newDate.setDate(newDate.getDate() + 7);
                } else {
                  newDate.setDate(newDate.getDate() + 1);
                }
                setSelectedDate(newDate);
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="month" className="m-0">
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="border rounded-md p-4 pointer-events-auto"
                locale={fr}
                month={selectedDate || new Date()}
                fixedWeeks
                showOutsideDays
              />
              
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">
                  {selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : ''}
                </h3>
                
                {selectedDateReservations.length === 0 ? (
                  <p className="text-muted-foreground">Aucune réservation pour cette date</p>
                ) : (
                  <div className="space-y-2">
                    {selectedDateReservations.map(reservation => (
                      <div 
                        key={reservation.id}
                        className="p-2 border rounded-md hover:bg-muted transition-colors flex justify-between items-center"
                      >
                        <div>
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status === 'confirmed' ? 'Confirmée' :
                            reservation.status === 'pending' ? 'En attente' :
                            reservation.status === 'completed' ? 'Terminée' :
                            reservation.status === 'in-progress' ? 'En cours' : 
                            'Annulée'}
                          </Badge>
                          <div className="font-medium mt-1">{reservation.clientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {reservation.pickupLocation.address.substring(0, 30)}
                            {reservation.pickupLocation.address.length > 30 ? '...' : ''}
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewDetails(reservation)}
                        >
                          Détails
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="m-0">
          <Card>
            <CardContent className="p-4">
              <div className="text-xl font-semibold mb-4">
                Semaine du {selectedDate ? format(selectedDate, "d MMMM yyyy", { locale: fr }) : ''}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 7 }).map((_, i) => {
                  const date = new Date(selectedDate || new Date());
                  const startOfWeek = new Date(date);
                  startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Start from Monday
                  const dayDate = new Date(startOfWeek);
                  dayDate.setDate(startOfWeek.getDate() + i);
                  
                  const isToday = isSameDay(dayDate, new Date());
                  const reservations = getReservationsForDate(dayDate);

                  return (
                    <div 
                      key={i} 
                      className={`border rounded-md p-2 min-h-[140px] ${
                        isToday ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="text-center mb-2 font-medium">
                        {format(dayDate, "EEEE", { locale: fr })}
                        <div className={`text-sm ${isToday ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}`}>
                          {format(dayDate, "d")}
                        </div>
                      </div>
                      <div className="space-y-1">
                        {reservations.map(reservation => (
                          <div 
                            key={reservation.id}
                            className="text-xs p-1 rounded bg-muted overflow-hidden text-ellipsis whitespace-nowrap"
                          >
                            <Badge className={getStatusColor(reservation.status)} variant="secondary" />
                            <span className="ml-1">{reservation.clientName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="day" className="m-0">
          <Card>
            <CardContent className="p-4">
              <div className="text-xl font-semibold mb-4">
                {selectedDate ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr }) : ''}
              </div>
              
              {selectedDateReservations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Aucune réservation pour cette date
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateReservations.map(reservation => (
                    <div 
                      key={reservation.id}
                      className="border rounded-md p-3 hover:bg-muted transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge className={getStatusColor(reservation.status)}>
                            {reservation.status === 'confirmed' ? 'Confirmée' :
                             reservation.status === 'pending' ? 'En attente' :
                             reservation.status === 'completed' ? 'Terminée' :
                             reservation.status === 'in-progress' ? 'En cours' : 
                             'Annulée'}
                          </Badge>
                          <h4 className="text-base font-medium mt-2">{reservation.clientName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {reservation.pickupLocation.address} → {reservation.dropoffLocation.address}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewDetails(reservation)}
                          className="flex gap-1 items-center"
                        >
                          <Eye size={14} />
                          <span>Détails</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedReservation && (
        <ViewReservationDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
          reservation={selectedReservation}
        />
      )}
    </div>
  );
};

export default ReservationsCalendar;
