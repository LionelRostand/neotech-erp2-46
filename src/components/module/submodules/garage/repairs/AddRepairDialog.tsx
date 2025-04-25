
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepairAdded?: () => void;
}

const AddRepairDialog = ({ open, onOpenChange, onRepairAdded }: AddRepairDialogProps) => {
  const { clients, mechanics, vehicles, services, appointments } = useGarageData();
  const [formData, setFormData] = useState({
    clientId: '',
    vehicleId: '',
    mechanicId: '',
    serviceId: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    status: 'awaiting_approval',
    progress: 0,
    appointmentId: ''
  });

  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [filteredVehicles, setFilteredVehicles] = useState<any[]>([]);

  useEffect(() => {
    if (formData.clientId) {
      const clientVehicles = vehicles.filter(v => v.clientId === formData.clientId);
      setFilteredVehicles(clientVehicles);
    } else {
      setFilteredVehicles([]);
    }
  }, [formData.clientId, vehicles]);

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(client);
    setFormData(prev => ({
      ...prev,
      clientId,
      vehicleId: '', // Reset vehicle when client changes
      clientName: client ? `${client.firstName} ${client.lastName}` : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
      const selectedMechanic = mechanics.find(m => m.id === formData.mechanicId);
      const selectedService = services.find(s => s.id === formData.serviceId);
      const selectedAppointment = appointments.find(a => a.id === formData.appointmentId);

      const repairData = {
        ...formData,
        createdAt: new Date().toISOString(),
        vehicleInfo: selectedVehicle ? `${selectedVehicle.make} ${selectedVehicle.model}` : '',
        mechanicName: selectedMechanic ? `${selectedMechanic.firstName} ${selectedMechanic.lastName}` : '',
        serviceName: selectedService?.name || '',
        appointmentInfo: selectedAppointment ? {
          date: selectedAppointment.date,
          time: selectedAppointment.time
        } : null
      };

      await addDoc(collection(db, COLLECTIONS.GARAGE.REPAIRS), repairData);
      toast.success('Réparation ajoutée avec succès');
      onOpenChange(false);
      if (onRepairAdded) onRepairAdded();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réparation:', error);
      toast.error('Erreur lors de l\'ajout de la réparation');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réparation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select onValueChange={handleClientChange} value={formData.clientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle">Véhicule</Label>
              <Select 
                onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value }))}
                value={formData.vehicleId}
                disabled={!formData.clientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {filteredVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mechanic">Mécanicien</Label>
              <Select 
                onValueChange={(value) => setFormData(prev => ({ ...prev, mechanicId: value }))}
                value={formData.mechanicId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mécanicien" />
                </SelectTrigger>
                <SelectContent>
                  {mechanics.map((mechanic) => (
                    <SelectItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.firstName} {mechanic.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select 
                onValueChange={(value) => setFormData(prev => ({ ...prev, serviceId: value }))}
                value={formData.serviceId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="appointment">Rendez-vous associé</Label>
            <Select 
              onValueChange={(value) => setFormData(prev => ({ ...prev, appointmentId: value }))}
              value={formData.appointmentId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rendez-vous" />
              </SelectTrigger>
              <SelectContent>
                {appointments
                  .filter(apt => apt.clientId === formData.clientId)
                  .map((appointment) => (
                    <SelectItem key={appointment.id} value={appointment.id}>
                      {appointment.date} {appointment.time}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la réparation"
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Ajouter la réparation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairDialog;
