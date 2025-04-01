
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Reservation } from '../types/reservation-types';
import { toast } from "sonner";

interface EditReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
  onReservationUpdated?: (reservation: Reservation) => void;
}

const EditReservationDialog: React.FC<EditReservationDialogProps> = ({
  open,
  onOpenChange,
  reservation,
  onReservationUpdated
}) => {
  // Form state
  const [formData, setFormData] = useState({
    client: reservation.client, // Use client instead of clientId
    vehicle: reservation.vehicle, // Use vehicle instead of vehicleId 
    driver: reservation.driver, // Use driver instead of driverId
    startDate: reservation.startDate,
    endDate: reservation.endDate,
    pickupLocation: reservation.pickupLocation.address,
    dropoffLocation: reservation.dropoffLocation.address,
    totalAmount: reservation.totalAmount,
    status: reservation.status,
    paymentStatus: reservation.paymentStatus,
    notes: reservation.notes
  });

  // Handle form field changes
  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would submit to an API
    console.log('Submitting updated reservation:', formData);
    
    // Mock update
    const updatedReservation = {
      ...reservation,
      ...formData,
      pickupLocation: { address: formData.pickupLocation },
      dropoffLocation: { address: formData.dropoffLocation },
      updatedAt: new Date().toISOString()
    };
    
    // Notify parent component
    if (onReservationUpdated) {
      onReservationUpdated(updatedReservation);
    }
    
    toast.success('Réservation mise à jour avec succès');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier la réservation</DialogTitle>
          <DialogDescription>
            Réservation #{reservation.id} - {reservation.clientName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentStatus">Statut de paiement</Label>
              <Select 
                value={formData.paymentStatus} 
                onValueChange={(value) => handleChange('paymentStatus', value)}
              >
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="Statut de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="partial">Partiel</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="refunded">Remboursé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickupLocation">Lieu de prise en charge</Label>
              <Input
                id="pickupLocation"
                value={formData.pickupLocation}
                onChange={(e) => handleChange('pickupLocation', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dropoffLocation">Lieu de dépose</Label>
              <Input
                id="dropoffLocation"
                value={formData.dropoffLocation}
                onChange={(e) => handleChange('dropoffLocation', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalAmount">Montant total (€)</Label>
            <Input
              id="totalAmount"
              type="number"
              value={formData.totalAmount}
              onChange={(e) => handleChange('totalAmount', parseFloat(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditReservationDialog;
