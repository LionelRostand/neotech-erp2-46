
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fr } from "date-fns/locale";
import { compareDesc } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Car, Users } from "lucide-react";
import { Reservation } from '../types/reservation-types';

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
  }
];

const ReservationsCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'vehicle'>('day');
  
  const getReservationsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    
    return mockReservations.filter(reservation => {
      const startDate = new Date(reservation.startDate);
      const endDate = new Date(reservation.endDate);
      const currentDate = new Date(dateString);
      
      // Check if the current date is between start and end dates (inclusive)
      return currentDate >= startDate && currentDate <= endDate;
    });
  };
  
  const reservationsOnSelectedDate = getReservationsForDate(selectedDate);
  
  const getDayHasReservation = (date: Date) => {
    const reservations = getReservationsForDate(date);
    return reservations.length > 0;
  };
  
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Calendrier des réservations</h3>
          <Select value={viewMode} onValueChange={(value: 'day' | 'vehicle') => setViewMode(value)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Mode d'affichage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Par jour</SelectItem>
              <SelectItem value="vehicle">Par véhicule</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="border rounded-md p-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="w-full"
            modifiers={{
              hasReservation: (date) => getDayHasReservation(date),
            }}
            modifiersStyles={{
              hasReservation: { backgroundColor: "#f3e8ff", fontWeight: "bold" }
            }}
          />
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#f3e8ff]"></div>
            <span>Avec réservations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span>Jour sélectionné</span>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <CalendarIcon size={18} />
          <span>Réservations du {selectedDate?.toLocaleDateString('fr-FR', { dateStyle: 'long' })}</span>
          <Badge className="ml-2">
            {reservationsOnSelectedDate.length} réservation{reservationsOnSelectedDate.length !== 1 ? 's' : ''}
          </Badge>
        </h3>
        
        {reservationsOnSelectedDate.length === 0 ? (
          <div className="text-center py-16 border rounded-md">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h4 className="text-lg font-medium mb-2">Aucune réservation</h4>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              Il n'y a pas de réservation prévue pour cette date.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reservationsOnSelectedDate
              .sort((a, b) => compareDesc(new Date(b.startDate), new Date(a.startDate)) * -1)
              .map((reservation) => (
                <Card key={reservation.id} className="overflow-hidden">
                  <div className={`h-1.5 w-full ${
                    reservation.status === 'confirmed' ? 'bg-green-500' :
                    reservation.status === 'pending' ? 'bg-yellow-500' :
                    reservation.status === 'completed' ? 'bg-blue-500' :
                    reservation.status === 'cancelled' ? 'bg-red-500' :
                    'bg-gray-500'
                  }`}></div>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{reservation.clientName}</h4>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Car size={14} />
                          <span>Réservation #{reservation.id}</span>
                          {reservation.driverId && (
                            <>
                              <span className="mx-1">•</span>
                              <Users size={14} />
                              <span>Avec chauffeur</span>
                            </>
                          )}
                        </div>
                        
                        <div className="mt-4 space-y-1">
                          <div>
                            <span className="text-xs text-muted-foreground">Départ:</span>
                            <div className="flex items-center justify-between">
                              <div>{reservation.pickupLocation}</div>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-xs text-muted-foreground">Arrivée:</span>
                            <div className="flex items-center justify-between">
                              <div>{reservation.dropoffLocation}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between">
                        <Badge variant={reservation.paymentStatus === 'paid' ? 'secondary' : 'outline'}>
                          {reservation.paymentStatus === 'paid' ? 'Payée' : 
                           reservation.paymentStatus === 'partial' ? 'Partiellement payée' : 'En attente de paiement'}
                        </Badge>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {reservation.totalAmount} €
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Statut: {
                              reservation.status === 'confirmed' ? 'Confirmée' :
                              reservation.status === 'pending' ? 'En attente' :
                              reservation.status === 'completed' ? 'Terminée' :
                              reservation.status === 'cancelled' ? 'Annulée' : 'Inconnu'
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {reservation.notes && (
                      <div className="mt-4 border-t pt-3 text-sm">
                        <span className="font-medium">Notes: </span>
                        {reservation.notes}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationsCalendar;
