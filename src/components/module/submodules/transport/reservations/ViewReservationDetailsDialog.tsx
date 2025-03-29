
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Reservation } from '../types/reservation-types';
import { Calendar, Car, FileText, MapPin, User, CreditCard } from "lucide-react";

interface ViewReservationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
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

const ViewReservationDetailsDialog: React.FC<ViewReservationDetailsDialogProps> = ({
  open,
  onOpenChange,
  reservation,
}) => {
  // Mocked data for vehicle and driver names
  const vehicleName = {
    "veh-001": "Mercedes Classe E",
    "veh-002": "Tesla Model S",
    "veh-003": "BMW Série 7",
    "veh-004": "Audi A8",
  }[reservation.vehicleId] || "Véhicule inconnu";

  const driverName = reservation.driverId ? {
    "drv-001": "Thomas Martin",
    "drv-002": "Luc Bernard",
    "drv-003": "Émilie Dubois",
  }[reservation.driverId] || "Chauffeur inconnu" : "Sans chauffeur";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails de la réservation #{reservation.id}</span>
            {getStatusBadge(reservation.status)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="bg-muted rounded-full p-2">
              <FileText className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Référence</p>
              <p className="text-sm">{reservation.id}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Créée le {new Date(reservation.createdAt).toLocaleString('fr-FR')}
              </p>
              {reservation.createdAt !== reservation.updatedAt && (
                <p className="text-sm text-muted-foreground">
                  Mise à jour le {new Date(reservation.updatedAt).toLocaleString('fr-FR')}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex items-start space-x-4">
            <div className="bg-muted rounded-full p-2">
              <User className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Client</p>
              <p className="text-sm">{reservation.clientName}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-muted rounded-full p-2">
              <Car className="h-5 w-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Véhicule</p>
                  <p className="text-sm">{vehicleName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Chauffeur</p>
                  <p className="text-sm">{driverName}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-muted rounded-full p-2">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm font-medium">Date de début</p>
                  <p className="text-sm">{formatDate(reservation.startDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Date de fin</p>
                  <p className="text-sm">{formatDate(reservation.endDate)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-start space-x-4">
              <div className="bg-muted rounded-full p-2">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Adresse de départ</p>
                <p className="text-sm">{reservation.pickupLocation}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-muted rounded-full p-2">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Adresse d'arrivée</p>
                <p className="text-sm">{reservation.dropoffLocation}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex items-start space-x-4">
            <div className="bg-muted rounded-full p-2">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Prix total</p>
                <p className="font-bold">{reservation.totalAmount} €</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Statut de paiement</p>
                <div>
                  {reservation.paymentStatus === 'paid' && (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Payé</Badge>
                  )}
                  {reservation.paymentStatus === 'partial' && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Partiel</Badge>
                  )}
                  {reservation.paymentStatus === 'pending' && (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">En attente</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {reservation.notes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Notes</p>
                <p className="text-sm bg-muted p-3 rounded">{reservation.notes}</p>
              </div>
            </>
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

export default ViewReservationDetailsDialog;
