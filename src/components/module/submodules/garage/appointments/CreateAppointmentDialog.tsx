
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Appointment } from '../types/garage-types';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  clientsMap: Record<string, string>;
  vehiclesMap: Record<string, string>;
  mechanicsMap: Record<string, string>;
}

const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  clientsMap,
  vehiclesMap,
  mechanicsMap
}) => {
  const [formData, setFormData] = useState({
    clientId: '',
    vehicleId: '',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    duration: '60',
    reason: '',
    mechanicId: '',
    status: 'scheduled',
    notes: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      clientId: formData.clientId,
      vehicleId: formData.vehicleId,
      date: formData.date,
      time: formData.time,
      duration: parseInt(formData.duration),
      reason: formData.reason,
      mechanicId: formData.mechanicId,
      status: formData.status as "scheduled" | "in_progress" | "completed" | "cancelled",
      notes: formData.notes
    });
    onOpenChange(false);
  };

  const resetForm = () => {
    setFormData({
      clientId: '',
      vehicleId: '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: '60',
      reason: '',
      mechanicId: '',
      status: 'scheduled',
      notes: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!newOpen) resetForm();
      onOpenChange(newOpen);
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Nouveau Rendez-vous</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select 
                value={formData.clientId} 
                onValueChange={(value) => handleChange('clientId', value)}
              >
                <SelectTrigger id="clientId">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(clientsMap).map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Véhicule</Label>
              <Select 
                value={formData.vehicleId} 
                onValueChange={(value) => handleChange('vehicleId', value)}
              >
                <SelectTrigger id="vehicleId">
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(vehiclesMap).map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                type="date" 
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <Input 
                id="time" 
                type="time" 
                value={formData.time}
                onChange={(e) => handleChange('time', e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input 
                id="duration" 
                type="number" 
                value={formData.duration}
                onChange={(e) => handleChange('duration', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mechanicId">Mécanicien</Label>
              <Select 
                value={formData.mechanicId} 
                onValueChange={(value) => handleChange('mechanicId', value)}
              >
                <SelectTrigger id="mechanicId">
                  <SelectValue placeholder="Sélectionner un mécanicien" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(mechanicsMap).map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Raison du rendez-vous</Label>
            <Input 
              id="reason" 
              value={formData.reason}
              onChange={(e) => handleChange('reason', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes" 
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Créer le rendez-vous</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;
