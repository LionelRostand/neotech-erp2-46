
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Appointment } from '../types/garage-types';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
  clientName: string;
  onAppointmentCreated: () => void;
}

const serviceTypes = [
  { id: "maintenance", label: "Maintenance régulière" },
  { id: "repair", label: "Réparation" },
  { id: "diagnostic", label: "Diagnostic" },
  { id: "tire", label: "Changement de pneus" },
  { id: "oil", label: "Vidange d'huile" },
  { id: "brake", label: "Système de freinage" },
  { id: "other", label: "Autre" }
];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", 
  "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

const CreateAppointmentDialog: React.FC<CreateAppointmentDialogProps> = ({
  open,
  onOpenChange,
  clientId,
  clientName,
  onAppointmentCreated
}) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const [date, setDate] = useState<string>(format(tomorrow, 'yyyy-MM-dd'));
  const [time, setTime] = useState<string>("09:00");
  const [serviceType, setServiceType] = useState<string>("maintenance");
  const [vehicleId, setVehicleId] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [duration, setDuration] = useState<string>("60");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally save the appointment to your backend
    console.log("Creating appointment:", {
      clientId,
      clientName,
      date,
      time,
      serviceType,
      vehicleId,
      description,
      duration: parseInt(duration),
    });
    
    onAppointmentCreated();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Prendre un rendez-vous</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <div className="p-2 bg-muted rounded-md">
              {clientName} (ID: {clientId})
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  required
                />
                <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="time">Heure</Label>
              <Select value={time || timeSlots[0]} onValueChange={setTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Sélectionner une heure" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map(slot => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serviceType">Type de service</Label>
            <Select value={serviceType || serviceTypes[0].id} onValueChange={setServiceType}>
              <SelectTrigger id="serviceType">
                <SelectValue placeholder="Sélectionner un type de service" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vehicle">Véhicule</Label>
            <Select value={vehicleId || "no-selection"} onValueChange={setVehicleId} required>
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-selection" disabled>Sélectionner un véhicule</SelectItem>
                <SelectItem value="VH001">Peugeot 208 (VH001)</SelectItem>
                <SelectItem value="VH002">Renault Clio (VH002)</SelectItem>
                <SelectItem value="VH003">Citroën C3 (VH003)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="duration">Durée (minutes)</Label>
            <Select value={duration || "60"} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue placeholder="Sélectionner une durée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
                <SelectItem value="90">1 heure 30</SelectItem>
                <SelectItem value="120">2 heures</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description / Commentaires</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez le problème ou la raison du rendez-vous"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Confirmer le rendez-vous
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;
