
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCollectionData } from '@/lib/fetchCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Reservation } from '../../types/rental-types';
import { Calendar } from '@/components/ui/calendar';
import { addDays, format, isWithinInterval, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ReservationCalendar = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['rentals', 'reservations'],
    queryFn: () => fetchCollectionData<Reservation>(COLLECTIONS.TRANSPORT.RESERVATIONS)
  });

  // Get reservations for the selected date
  const getReservationsForDate = (date: Date | undefined) => {
    if (!date) return [];
    
    return reservations.filter(reservation => {
      try {
        const startDate = parseISO(reservation.startDate);
        const endDate = parseISO(reservation.endDate);
        
        return isWithinInterval(date, { start: startDate, end: endDate });
      } catch (error) {
        console.error('Error parsing reservation dates', error);
        return false;
      }
    });
  };

  // Get highlighted dates for the calendar
  const getDayClassNames = (date: Date) => {
    const hasReservation = getReservationsForDate(date).length > 0;
    return hasReservation ? 'bg-blue-100 text-blue-700 font-medium' : '';
  };

  const selectedDayReservations = getReservationsForDate(selectedDate);

  if (isLoading) {
    return <div className="flex items-center justify-center py-8">Chargement des réservations...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            locale={fr}
            className="rounded-md border"
            modifiersClassNames={{
              selected: "bg-primary text-primary-foreground",
            }}
            modifiers={{
              customModifier: (date) => getReservationsForDate(date).length > 0,
            }}
            styles={{
              day_today: { color: "var(--accent)" },
              day_customModifier: { backgroundColor: "var(--accent-foreground)", color: "white" },
            }}
          />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">
            {selectedDate ? (
              `Réservations du ${format(selectedDate, 'PPP', { locale: fr })}`
            ) : (
              "Sélectionnez une date"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedDayReservations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              Aucune réservation pour cette date
            </div>
          ) : (
            <div className="space-y-4">
              {selectedDayReservations.map(reservation => (
                <Card key={reservation.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{reservation.clientName}</h3>
                      <p className="text-sm text-muted-foreground">Véhicule: {reservation.vehicleId}</p>
                      <div className="mt-2 flex flex-col sm:flex-row sm:gap-4">
                        <span className="text-sm">
                          Début: {format(new Date(reservation.startDate), 'PPP', { locale: fr })}
                        </span>
                        <span className="text-sm">
                          Fin: {format(new Date(reservation.endDate), 'PPP', { locale: fr })}
                        </span>
                      </div>
                    </div>
                    <Badge className={
                      reservation.status === 'confirmed' ? 'bg-green-500' :
                      reservation.status === 'pending' ? 'bg-yellow-500' :
                      reservation.status === 'completed' ? 'bg-blue-500' :
                      'bg-red-500'
                    }>
                      {reservation.status === 'confirmed' ? 'Confirmée' :
                       reservation.status === 'pending' ? 'En attente' :
                       reservation.status === 'completed' ? 'Terminée' :
                       'Annulée'}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReservationCalendar;
