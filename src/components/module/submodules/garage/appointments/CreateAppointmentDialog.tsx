
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from 'sonner';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { GarageClient, Vehicle } from '../types/garage-types';

interface CreateAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: GarageClient[];
  vehicles: Vehicle[];
}

const CreateAppointmentDialog = ({ open, onOpenChange, clients, vehicles }: CreateAppointmentDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !selectedVehicle || !date || !time || !service) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Trouver les données du client
      const client = clients.find(c => c.id === selectedClient);
      
      // Trouver les données du véhicule
      const vehicle = vehicles.find(v => v.id === selectedVehicle);
      
      const appointmentData = {
        clientId: selectedClient,
        clientName: client?.name || 'Client inconnu',
        vehicleId: selectedVehicle,
        vehicleMake: vehicle?.make || 'Non spécifié',
        vehicleModel: vehicle?.model || 'Non spécifié',
        date,
        time,
        service,
        notes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      
      await addDoc(collection(db, COLLECTIONS.GARAGE.APPOINTMENTS), appointmentData);
      
      toast.success('Rendez-vous créé avec succès');
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la création du rendez-vous:', error);
      toast.error('Erreur lors de la création du rendez-vous');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedClient('');
    setSelectedVehicle('');
    setDate('');
    setTime('');
    setService('');
    setNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau rendez-vous</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleCreateAppointment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select 
              value={selectedClient} 
              onValueChange={setSelectedClient}
            >
              <SelectTrigger id="client">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.length > 0 ? (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-clients">Aucun client disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle">Véhicule</Label>
            <Select 
              value={selectedVehicle} 
              onValueChange={setSelectedVehicle}
              disabled={!selectedClient}
            >
              <SelectTrigger id="vehicle">
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {selectedClient && vehicles.filter(v => v.clientId === selectedClient).length > 0 ? (
                  vehicles
                    .filter(v => v.clientId === selectedClient)
                    .map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.make} {vehicle.model} ({vehicle.licensePlate || 'Non immatriculé'})
                      </SelectItem>
                    ))
                ) : (
                  <SelectItem value="no-vehicles">Aucun véhicule disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input 
              id="date" 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Heure</Label>
            <Input 
              id="time" 
              type="time" 
              value={time} 
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Input 
              id="service" 
              type="text" 
              placeholder="Ex: Révision, Changement de pneus..." 
              value={service} 
              onChange={(e) => setService(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea 
              id="notes" 
              placeholder="Notes supplémentaires..." 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer le rendez-vous'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointmentDialog;
