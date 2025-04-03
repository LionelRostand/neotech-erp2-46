
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Reservation } from '../types';

interface EditReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservation: Reservation | null;
  onSave: (updatedReservation: Reservation) => void;
}

const EditReservationDialog: React.FC<EditReservationDialogProps> = ({
  open,
  onOpenChange,
  reservation,
  onSave
}) => {
  // Set initial values from reservation or with defaults
  const [formData, setFormData] = useState({
    clientId: reservation?.clientId || '',
    clientName: reservation?.clientName || '',
    vehicleId: reservation?.vehicleId || '',
    driverId: reservation?.driverId || '',
    startDate: reservation?.startDate || '',
    endDate: reservation?.endDate || '',
    pickupLocation: reservation?.pickupLocation || '',
    dropoffLocation: reservation?.dropoffLocation || '',
    totalAmount: reservation?.totalAmount || 0,
    status: reservation?.status || 'pending',
    notes: reservation?.notes?.join('\n') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (reservation) {
      onSave({
        ...reservation,
        clientId: formData.clientId,
        clientName: formData.clientName,
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.dropoffLocation,
        totalAmount: formData.totalAmount,
        status: formData.status,
        notes: formData.notes ? formData.notes.split('\n') : [],
        updatedAt: new Date().toISOString()
      });
    }
    
    onOpenChange(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalAmount' ? parseFloat(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!reservation) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier la réservation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="clientName">Client</Label>
              <Input 
                id="clientName" 
                name="clientName" 
                value={formData.clientName} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="vehicleId">Véhicule ID</Label>
              <Input 
                id="vehicleId" 
                name="vehicleId" 
                value={formData.vehicleId} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="driverId">Chauffeur ID</Label>
              <Input 
                id="driverId" 
                name="driverId" 
                value={formData.driverId} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select 
                name="status" 
                value={formData.status} 
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="confirmed">Confirmée</SelectItem>
                  <SelectItem value="completed">Terminée</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                  <SelectItem value="in-progress">En cours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="startDate">Date de début</Label>
              <Input 
                id="startDate" 
                name="startDate" 
                type="datetime-local" 
                value={formData.startDate} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">Date de fin</Label>
              <Input 
                id="endDate" 
                name="endDate" 
                type="datetime-local" 
                value={formData.endDate} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="pickupLocation">Lieu de prise en charge</Label>
              <Input 
                id="pickupLocation" 
                name="pickupLocation" 
                value={formData.pickupLocation} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="dropoffLocation">Lieu de dépose</Label>
              <Input 
                id="dropoffLocation" 
                name="dropoffLocation" 
                value={formData.dropoffLocation} 
                onChange={handleInputChange} 
              />
            </div>
            
            <div>
              <Label htmlFor="totalAmount">Montant total</Label>
              <Input 
                id="totalAmount" 
                name="totalAmount" 
                type="number" 
                value={formData.totalAmount} 
                onChange={handleInputChange} 
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              name="notes" 
              value={formData.notes} 
              onChange={handleInputChange} 
              rows={3} 
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditReservationDialog;
