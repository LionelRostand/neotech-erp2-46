
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Reservation } from '../types';

interface EditReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation;
  onSave?: (updatedReservation: Reservation) => void;
}

const EditReservationDialog: React.FC<EditReservationDialogProps> = ({
  open,
  onOpenChange,
  reservation,
  onSave
}) => {
  // Form state
  const [formData, setFormData] = useState({
    client: reservation.client,
    clientName: reservation.clientName,
    vehicle: reservation.vehicle,
    driver: reservation.driver || '',
    status: reservation.status,
    paymentStatus: reservation.paymentStatus,
    totalAmount: reservation.totalAmount,
    startDate: reservation.startDate,
    endDate: reservation.endDate,
    pickupLocation: reservation.pickupLocation.address,
    dropoffLocation: reservation.dropoffLocation.address,
    notes: reservation.notes
  });

  // Update form field
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save changes
  const handleSave = () => {
    const updatedReservation: Reservation = {
      ...reservation,
      client: formData.client,
      clientName: formData.clientName,
      vehicle: formData.vehicle,
      driver: formData.driver,
      status: formData.status,
      paymentStatus: formData.paymentStatus,
      totalAmount: formData.totalAmount,
      startDate: formData.startDate,
      endDate: formData.endDate,
      pickupLocation: { address: formData.pickupLocation },
      dropoffLocation: { address: formData.dropoffLocation },
      notes: formData.notes
    };
    
    if (onSave) {
      onSave(updatedReservation);
    } else {
      toast.success("Réservation mise à jour avec succès");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Modifier la réservation</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client</Label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="vehicle">Véhicule</Label>
              <Input
                id="vehicle"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="driver">Chauffeur</Label>
            <Input
              id="driver"
              name="driver"
              value={formData.driver || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="pickupLocation">Lieu de prise en charge</Label>
            <Input
              id="pickupLocation"
              name="pickupLocation"
              value={formData.pickupLocation}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="dropoffLocation">Lieu de dépose</Label>
            <Input
              id="dropoffLocation"
              name="dropoffLocation"
              value={formData.dropoffLocation}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="paymentStatus">Statut de paiement</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => handleSelectChange('paymentStatus', value)}
              >
                <SelectTrigger id="paymentStatus">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="partial">Partiel</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="totalAmount">Montant total (€)</Label>
            <Input
              id="totalAmount"
              name="totalAmount"
              type="number"
              value={formData.totalAmount}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditReservationDialog;
