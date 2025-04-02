import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reservation, getAddressString } from '../types/reservation-types';

interface ViewReservationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
}

const ViewReservationDetailsDialog: React.FC<ViewReservationDetailsDialogProps> = ({
  open,
  onOpenChange,
  reservation,
}) => {
  // Format date string
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get badge based on reservation status
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
  
  // Get badge based on payment status
  const getPaymentBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Payée</Badge>;
      case 'partial':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Partielle</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-300">En attente</Badge>;
      default:
        return <Badge variant="outline">Inconnue</Badge>;
    }
  };

  // Safely handle reservation.notes with null checks
  const getNotes = () => {
    if (!reservation.notes) return '';
    
    if (typeof reservation.notes === 'string') {
      return reservation.notes;
    }

    if (Array.isArray(reservation.notes) && reservation.notes.length > 0) {
      const firstNote = reservation.notes[0];
      if (typeof firstNote === 'object' && firstNote && 'content' in firstNote) {
        return firstNote.content;
      }
      return Array.isArray(reservation.notes) ? reservation.notes.join(', ') : String(reservation.notes);
    }
    
    return '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la réservation {reservation.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Client</h3>
              <p>{reservation.clientName}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Statut</h3>
              <div className="flex space-x-2">
                {getStatusBadge(reservation.status)}
                {reservation.paymentStatus && getPaymentBadge(reservation.paymentStatus)}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-gray-200 pt-4">
            <div>
              <h3 className="font-semibold">Date de début</h3>
              <p>{reservation.startDate ? formatDate(reservation.startDate) : 'Non spécifiée'}</p>
            </div>
            <div>
              <h3 className="font-semibold">Date de fin</h3>
              <p>{reservation.endDate ? formatDate(reservation.endDate) : 'Non spécifiée'}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold">Adresse de départ</h3>
            <p>{getAddressString(reservation.pickupLocation)}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold">Adresse d'arrivée</h3>
            <p>{getAddressString(reservation.dropoffLocation)}</p>
          </div>
          
          {reservation.totalAmount && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold">Montant total</h3>
              <p className="text-xl font-semibold">{reservation.totalAmount} €</p>
            </div>
          )}
          
          {reservation.notes && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold">Notes</h3>
              <div>{getNotes()}</div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            onClick={() => onOpenChange(false)}
          >
            Fermer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReservationDetailsDialog;
