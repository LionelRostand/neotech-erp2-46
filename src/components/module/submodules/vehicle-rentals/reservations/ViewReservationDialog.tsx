
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Reservation } from '../types/rental-types';
import { Car, Calendar, MapPin, CreditCard, FileText, User } from "lucide-react";

interface ViewReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
  vehicleName: string;
  clientName: string;
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

// Mock locations data
const mockLocations: Record<string, string> = {
  "loc-001": "Agence Paris Centre",
  "loc-002": "Agence Lyon",
  "loc-003": "Agence Marseille"
};

const ViewReservationDialog: React.FC<ViewReservationDialogProps> = ({
  open,
  onOpenChange,
  reservation,
  vehicleName,
  clientName
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Détails de la réservation</span>
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
            </div>
          </div>

          <Separator />

          <div className="flex items-start space-x-4">
            <div className="bg-muted rounded-full p-2">
              <User className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Client</p>
              <p className="text-sm">{clientName}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-muted rounded-full p-2">
              <Car className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Véhicule</p>
              <p className="text-sm">{vehicleName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-4">
              <div className="bg-muted rounded-full p-2">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Période de location</p>
                <p className="text-sm">Du {formatDate(reservation.startDate)}</p>
                <p className="text-sm">Au {formatDate(reservation.endDate)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-muted rounded-full p-2">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Emplacements</p>
                <p className="text-sm">Prise: {mockLocations[reservation.pickupLocationId]}</p>
                <p className="text-sm">Retour: {mockLocations[reservation.returnLocationId]}</p>
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
                <p className="font-bold">{reservation.totalPrice} €</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Caution</p>
                <div>
                  <span className="mr-2">{reservation.depositAmount} €</span>
                  {reservation.depositPaid ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Payée</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>
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

        <DialogFooter className="sm:justify-between">
          <div className="text-xs text-muted-foreground">
            Créée le {new Date(reservation.createdAt).toLocaleString()}
          </div>
          <Button
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReservationDialog;
