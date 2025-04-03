
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransportReservation } from '../types/reservation-types';
import { Calendar, MapPin } from "lucide-react";

interface ClientHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientName: string;
  clientReservations: TransportReservation[];
}

const ClientHistoryDialog: React.FC<ClientHistoryDialogProps> = ({
  open,
  onOpenChange,
  clientName,
  clientReservations,
}) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmée</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Terminée</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulée</Badge>;
      default:
        return <Badge>Inconnue</Badge>;
    }
  };
  
  // Helper function to safely display pickup/dropoff locations
  const displayLocation = (location: string | { address: string; datetime: string }) => {
    if (typeof location === 'string') {
      return location;
    } else if (location && typeof location === 'object') {
      return location.address;
    }
    return 'Non spécifié';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Historique du client</DialogTitle>
          <DialogDescription>Réservations pour {clientName}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="reservations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="reservations" className="flex items-center gap-2">
              <Calendar size={16} />
              <span>Réservations</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Carte</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reservations" className="space-y-2">
            {clientReservations.length === 0 ? (
              <p>Aucune réservation trouvée pour ce client.</p>
            ) : (
              <div className="divide-y divide-gray-200">
                {clientReservations.map((reservation) => (
                  <div key={reservation.id} className="py-2">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">Réservation #{reservation.id}</h3>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(reservation.createdAt)}
                        </p>
                      </div>
                      <div>
                        {getStatusBadge(reservation.status)}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm">
                        Départ: {displayLocation(reservation.pickup)}
                      </p>
                      <p className="text-sm">
                        Arrivée: {displayLocation(reservation.dropoff)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="map">
            <p>Carte des réservations (non implémenté)</p>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ClientHistoryDialog;
