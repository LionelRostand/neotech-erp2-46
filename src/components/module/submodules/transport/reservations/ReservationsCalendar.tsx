import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { format, isEqual, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Reservation, getAddressString } from '../types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import ViewReservationDetailsDialog from './ViewReservationDetailsDialog';

const mockReservations: Partial<Reservation>[] = [
  {
    id: "res001",
    client: "Marie Dupont",
    clientName: "Marie Dupont",
    startDate: "2023-11-10",
    endDate: "2023-11-12",
    pickupLocation: { address: "15 Rue de la Paix, Paris" },
    dropoffLocation: { address: "Charles de Gaulle Airport, Terminal 2E" },
    totalAmount: 320,
    status: "confirmed",
    paymentStatus: "paid",
    notes: "Client VIP, préférence siège avant",
    vehicle: "Mercedes Classe E",
    date: "2023-11-10",
    time: "09:00"
  },
  {
    id: "rsv-002",
    client: "Pierre Dubois",
    clientName: "Pierre Dubois",
    startDate: "2023-11-15",
    endDate: "2023-11-15",
    pickupLocation: { address: "Aéroport CDG Terminal 2E, Paris" },
    dropoffLocation: { address: "25 rue du Faubourg Saint-Honoré, 75008 Paris" },
    status: "pending",
    serviceType: "airport-transfer",
    price: 120,
    paymentStatus: "unpaid",
    isPaid: false,
    notes: [],
    createdAt: "2023-11-01T09:45:00",
    pickup: "Aéroport CDG Terminal 2E, Paris",
    dropoff: "25 rue du Faubourg Saint-Honoré, 75008 Paris",
    totalAmount: 120
  },
  {
    id: "rsv-003",
    client: "Sophie Laurent",
    clientName: "Sophie Laurent",
    startDate: "2023-11-08",
    endDate: "2023-11-10",
    pickupLocation: { address: "Gare de Lyon, Paris" },
    dropoffLocation: { address: "Gare de Lyon, Paris" },
    status: "completed",
    serviceType: "hourly-hire",
    price: 320,
    paymentStatus: "paid",
    isPaid: true,
    notes: [{ content: "Location sans chauffeur" }],
    createdAt: "2023-10-20T11:15:00",
    pickup: "Gare de Lyon, Paris",
    dropoff: "Gare de Lyon, Paris",
    totalAmount: 320
  },
  {
    id: "rsv-004",
    client: "Jean Moreau",
    clientName: "Jean Moreau",
    startDate: "2023-11-20",
    endDate: "2023-11-20",
    pickupLocation: { address: "Hôtel Ritz, Place Vendôme, Paris" },
    dropoffLocation: { address: "Opéra Garnier, Paris" },
    status: "confirmed",
    serviceType: "point-to-point",
    price: 180,
    paymentStatus: "partial",
    isPaid: false,
    notes: [],
    createdAt: "2023-11-05T16:20:00",
    pickup: "Hôtel Ritz, Place Vendôme, Paris",
    dropoff: "Opéra Garnier, Paris",
    totalAmount: 180
  },
  {
    id: "rsv-005",
    client: "Isabelle Bernard",
    clientName: "Isabelle Bernard",
    startDate: "2023-11-25",
    endDate: "2023-11-27",
    pickupLocation: { address: "Gare Montparnasse, Paris" },
    dropoffLocation: { address: "Gare Montparnasse, Paris" },
    status: "pending",
    serviceType: "day-tour",
    price: 420,
    paymentStatus: "unpaid",
    isPaid: false,
    notes: [{ content: "Location sans chauffeur, kilométrage illimité" }],
    createdAt: "2023-11-07T10:10:00",
    pickup: "Gare Montparnasse, Paris",
    dropoff: "Gare Montparnasse, Paris",
    totalAmount: 420
  }
];

const ReservationsCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedReservation, setSelectedReservation] = useState<Partial<Reservation> | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'day'>('month');
  
  const getReservationsForDate = (date: Date) => {
    return mockReservations.filter(reservation => {
      const start = new Date(reservation.startDate!);
      const end = new Date(reservation.endDate!);
      return date >= start && date <= end;
    });
  };

  const selectedDateReservations = selectedDate 
    ? getReservationsForDate(selectedDate) 
    : [];

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

  const handleViewDetails = (reservation: Partial<Reservation>) => {
    setSelectedReservation(reservation);
    setIsDetailsDialogOpen(true);
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
                          <Badge className={getStatusColor(reservation.status || '')}>
                            {reservation.status === 'confirmed' ? 'Confirmée' :
                            reservation.status === 'pending' ? 'En attente' :
                            reservation.status === 'completed' ? 'Terminée' :
                            reservation.status === 'in-progress' ? 'En cours' : 
                            'Annulée'}
                          </Badge>
                          <div className="font-medium mt-1">{reservation.clientName}</div>
                          <div className="text-sm text-muted-foreground">
                            {getAddressString(reservation.pickupLocation)}
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
                  
                  const isToday = isEqual(dayDate, new Date());
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
                            <Badge className={getStatusColor(reservation.status || '')} variant="secondary" />
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
                          <Badge className={getStatusColor(reservation.status || '')}>
                            {reservation.status === 'confirmed' ? 'Confirmée' :
                             reservation.status === 'pending' ? 'En attente' :
                             reservation.status === 'completed' ? 'Terminée' :
                             reservation.status === 'in-progress' ? 'En cours' : 
                             'Annulée'}
                          </Badge>
                          <h4 className="text-base font-medium mt-2">{reservation.clientName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {getAddressString(reservation.pickupLocation)} → {getAddressString(reservation.dropoffLocation)}
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
          reservation={selectedReservation as any}
        />
      )}
    </div>
  );
};

export default ReservationsCalendar;
