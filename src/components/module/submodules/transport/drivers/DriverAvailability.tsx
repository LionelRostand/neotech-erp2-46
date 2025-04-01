
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { fr } from 'date-fns/locale';
import { Car, CalendarCheck } from "lucide-react";
import { TransportDriver } from '../types/transport-types';

interface AssignedReservation {
  id: string;
  driverId: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  pickup: string;
  dropoff: string;
  status: string;
}

interface DriverAvailabilityProps {
  driver: TransportDriver;
  assignedReservations: AssignedReservation[];
}

const DriverAvailability: React.FC<DriverAvailabilityProps> = ({
  driver,
  assignedReservations
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Format date from YYYY-MM-DD to local date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', { dateStyle: 'long' });
  };
  
  // Get formatted service type
  const getServiceLabel = (service: string) => {
    switch (service) {
      case "airport-transfer": return "Transfert Aéroport";
      case "city-tour": return "Visite de ville";
      case "business-travel": return "Voyage d'affaires";
      case "wedding": return "Mariage";
      case "event": return "Événement";
      case "hourly-hire": return "Location à l'heure";
      case "long-distance": return "Longue distance";
      case "custom": return "Personnalisé";
      default: return service;
    }
  };
  
  // Get reservation status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmée</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-500">En cours</Badge>;
      case "completed":
        return <Badge className="bg-gray-500">Terminée</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };
  
  // Filter reservations for selected date
  const getReservationsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return assignedReservations.filter(res => res.date === dateStr);
  };
  
  const reservationsForSelectedDate = selectedDate 
    ? getReservationsForDate(selectedDate) 
    : [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Statut de disponibilité</h4>
                <div className="flex justify-between items-center p-3 rounded-md bg-gray-50">
                  <span>Disponibilité actuelle:</span>
                  <Badge className={driver.available ? "bg-green-500" : "bg-red-500"}>
                    {driver.available ? "Disponible" : "Indisponible"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center p-3 rounded-md bg-gray-50">
                  <span>Statut du chauffeur:</span>
                  <Badge className={
                    driver.status === 'active' ? "bg-green-500" : 
                    driver.status === 'on_leave' ? "bg-yellow-500" : 
                    "bg-red-500"
                  }>
                    {driver.status === 'active' ? "Actif" : 
                     driver.status === 'on_leave' ? "En congé" : 
                     "Inactif"}
                  </Badge>
                </div>
                
                <div className="flex justify-end">
                  <Button size="sm">Modifier la disponibilité</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={fr}
              className="rounded-md border"
            />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">
                {selectedDate ? (
                  `Réservations pour le ${selectedDate.toLocaleDateString('fr-FR', { dateStyle: 'long' })}`
                ) : (
                  "Sélectionnez une date"
                )}
              </h4>
              <Button variant="outline" size="sm">
                Voir toutes les réservations
              </Button>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Heure</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reservationsForSelectedDate.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        Aucune réservation pour cette date
                      </TableCell>
                    </TableRow>
                  ) : (
                    reservationsForSelectedDate.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell className="font-medium">{reservation.id}</TableCell>
                        <TableCell>{reservation.clientName}</TableCell>
                        <TableCell>{reservation.time}</TableCell>
                        <TableCell>{getServiceLabel(reservation.service)}</TableCell>
                        <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            Voir détails
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <CalendarCheck size={16} />
                  <span>Périodes d'indisponibilité planifiées</span>
                </h4>
                
                <div className="space-y-4">
                  <div className="border rounded-md p-3 bg-gray-50">
                    <p className="text-sm text-muted-foreground">
                      Aucune période d'indisponibilité planifiée pour {driver.firstName} {driver.lastName}.
                    </p>
                  </div>
                  
                  <Button variant="outline" size="sm">
                    Planifier une indisponibilité
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAvailability;
