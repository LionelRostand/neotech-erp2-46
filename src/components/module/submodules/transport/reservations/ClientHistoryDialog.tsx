import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Calendar, Car, MapPin } from "lucide-react";
import { TransportReservation, TransportClient } from '../types/transport-types';

interface ClientHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client?: TransportClient;
  reservations: TransportReservation[];
  onViewReservation: (reservation: TransportReservation) => void;
}

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Format service for display
const formatService = (service: string) => {
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

// Helper function to safely access pickup/dropoff address
const getLocationAddress = (location?: string | { address: string }): string => {
  if (!location) return "";
  if (typeof location === "string") return location;
  return location.address || "";
};

// Status badges
const getStatusBadge = (status: string) => {
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

// Vehicle names (mock)
const mockVehicleNames: Record<string, string> = {
  "veh-001": "Mercedes Classe E",
  "veh-002": "BMW Série 5",
  "veh-003": "Audi A6",
  "veh-004": "Mercedes Classe V",
  "veh-005": "Tesla Model S"
};

const ClientHistoryDialog: React.FC<ClientHistoryDialogProps> = ({
  open,
  onOpenChange,
  client,
  reservations,
  onViewReservation
}) => {
  if (!client) return null;

  const completedReservations = reservations.filter(r => r.status === "completed");
  const upcomingReservations = reservations.filter(r => ["confirmed", "pending"].includes(r.status));
  const cancelledReservations = reservations.filter(r => r.status === "cancelled");

  // Calculate total spent
  const totalSpent = completedReservations.reduce((sum, res) => sum + (res.price || 0), 0);
  
  // Sort reservations by date
  const sortedUpcoming = [...upcomingReservations].sort((a, b) => 
    new Date(a.date || '').getTime() - new Date(b.date || '').getTime()
  );
  
  const sortedCompleted = [...completedReservations].sort((a, b) => 
    new Date(b.date || '').getTime() - new Date(a.date || '').getTime()
  );
  
  // Get client name using firstName/lastName if available, otherwise fall back to name property
  const clientFullName = client.firstName && client.lastName 
    ? `${client.firstName} ${client.lastName}`
    : client.name;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Historique Client - {clientFullName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Réservations totales</p>
              <p className="text-2xl font-bold">{reservations.length}</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Total dépensé</p>
              <p className="text-2xl font-bold">{totalSpent} €</p>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">Points de fidélité</p>
              <p className="text-2xl font-bold">{client.loyaltyPoints}</p>
            </div>
          </div>
          
          {upcomingReservations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Réservations à venir</h3>
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="space-y-4 p-4">
                  {sortedUpcoming.map(reservation => (
                    <div 
                      key={reservation.id} 
                      className="border rounded-lg p-3 hover:bg-muted cursor-pointer"
                      onClick={() => onViewReservation(reservation)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{reservation.service ? formatService(reservation.service) : ''}</span>
                        {getStatusBadge(reservation.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{reservation.date ? formatDate(reservation.date) : ''} {reservation.time || ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          <span>{reservation.vehicleId ? mockVehicleNames[reservation.vehicleId] || '' : ''}</span>
                        </div>
                        <div className="flex items-center gap-1 col-span-2">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">
                            {getLocationAddress(reservation.pickup)} → {getLocationAddress(reservation.dropoff)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {completedReservations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Réservations passées</h3>
              <ScrollArea className="h-[200px] rounded-md border">
                <div className="space-y-4 p-4">
                  {sortedCompleted.map(reservation => (
                    <div 
                      key={reservation.id} 
                      className="border rounded-lg p-3 hover:bg-muted cursor-pointer"
                      onClick={() => onViewReservation(reservation)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium">{reservation.service ? formatService(reservation.service) : ''}</span>
                        {getStatusBadge(reservation.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{reservation.date ? formatDate(reservation.date) : ''} {reservation.time || ''}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Car className="h-4 w-4" />
                          <span>{reservation.vehicleId ? mockVehicleNames[reservation.vehicleId] || '' : ''}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {cancelledReservations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-3">Réservations annulées</h3>
              <div className="text-sm text-muted-foreground">
                {cancelledReservations.length} réservation(s) annulée(s)
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientHistoryDialog;
