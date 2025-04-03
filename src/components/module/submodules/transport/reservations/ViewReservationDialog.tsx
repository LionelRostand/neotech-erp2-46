
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TransportReservation } from '../types/reservation-types';
import { Car, Calendar, MapPin, CreditCard, FileText, User, UserCheck } from "lucide-react";

interface ViewReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: TransportReservation;
  clientName: string;
  vehicleName: string;
  driverName?: string;
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

// Format service types for display
const getServiceLabel = (service: string | { name: string } | undefined): string => {
  if (!service) return "Service non spécifié";
  
  if (typeof service === "object" && service.name) {
    return service.name;
  }
  
  if (typeof service === "string") {
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
  }
  
  return "Service non spécifié";
};

// Helper function to safely access pickup/dropoff address
const getLocationAddress = (location?: string | { address: string }): string => {
  if (!location) return "";
  if (typeof location === "string") return location;
  return location.address || "";
};

// Helper to format reservation notes for display
const formatNotes = (notes: any): string => {
  if (!notes) return '';
  
  if (typeof notes === 'string') {
    return notes;
  }
  
  if (Array.isArray(notes)) {
    if (notes.length === 0) return '';
    
    return notes.map(note => {
      if (typeof note === 'string') return note;
      if (typeof note === 'object' && note && 'content' in note) {
        return note.content;
      }
      return JSON.stringify(note);
    }).join(', ');
  }
  
  if (typeof notes === 'object' && notes !== null) {
    return Object.values(notes).join(', ');
  }
  
  return String(notes);
};

const ViewReservationDialog: React.FC<ViewReservationDialogProps> = ({
  open,
  onOpenChange,
  reservation,
  clientName,
  vehicleName,
  driverName
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
              <p className="text-sm font-medium mt-2">Service</p>
              <p className="text-sm">{getServiceLabel(reservation.service)}</p>
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

          {reservation.needsDriver && (
            <div className="flex items-start space-x-4">
              <div className="bg-muted rounded-full p-2">
                <UserCheck className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Chauffeur</p>
                <p className="text-sm">{driverName || "Non assigné"}</p>
              </div>
            </div>
          )}

          <div className="flex items-start space-x-4">
            <div className="bg-muted rounded-full p-2">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Date et Heure</p>
              <p className="text-sm">{reservation.date ? formatDate(reservation.date) : ''} à {reservation.time || ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-4">
              <div className="bg-muted rounded-full p-2">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Adresse de prise en charge</p>
                <p className="text-sm">{getLocationAddress(reservation.pickup)}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-muted rounded-full p-2">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Adresse de destination</p>
                <p className="text-sm">{getLocationAddress(reservation.dropoff)}</p>
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
                <p className="font-bold">{reservation.price} €</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Statut de paiement</p>
                <div>
                  {reservation.isPaid ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Payé</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">En attente</Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm font-medium">Contrat</p>
                <div>
                  {reservation.contractGenerated ? (
                    <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Généré</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">Non généré</Badge>
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
                <p className="text-sm bg-muted p-3 rounded">{formatNotes(reservation.notes)}</p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="sm:justify-between">
          <div className="text-xs text-muted-foreground">
            Créée le {new Date(reservation.createdAt || '').toLocaleString()}
          </div>
          <div className="flex gap-2">
            {!reservation.contractGenerated && (
              <Button
                variant="outline"
                onClick={() => console.log("Générer contrat pour", reservation.id)}
              >
                Générer un contrat
              </Button>
            )}
            <Button
              onClick={() => onOpenChange(false)}
            >
              Fermer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReservationDialog;
