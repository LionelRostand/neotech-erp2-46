
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepairAdded: () => void;
}

const AddRepairDialog: React.FC<AddRepairDialogProps> = ({
  open,
  onOpenChange,
  onRepairAdded
}) => {
  const { clients, vehicles, mechanics, services, appointments } = useGarageData();
  const [selectedClient, setSelectedClient] = useState('');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    clientName: '',
    clientId: '',
    vehicleName: '',
    vehicleId: '',
    description: '',
    mechanicName: '',
    mechanicId: '',
    appointmentId: '',
    serviceId: '',
    serviceName: '',
    status: 'pending',
    progress: 0
  });

  const filteredVehicles = vehicles.filter(v => v.clientId === selectedClient);
  const filteredAppointments = appointments.filter(a => a.clientId === selectedClient);

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    setSelectedClient(clientId);
    setFormData(prev => ({
      ...prev,
      clientId,
      clientName: client ? `${client.firstName} ${client.lastName}` : '',
      vehicleId: '',
      vehicleName: '',
      appointmentId: ''
    }));
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, COLLECTIONS.GARAGE.REPAIRS), {
        ...formData,
        createdAt: new Date().toISOString()
      });
      toast.success('Réparation ajoutée avec succès');
      onRepairAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réparation:', error);
      toast.error('Erreur lors de l\'ajout de la réparation');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une réparation</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
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

          <div className="grid gap-2">
            <Label htmlFor="vehicle">Véhicule</Label>
            <Select 
              onValueChange={(value) => {
                const vehicle = vehicles.find(v => v.id === value);
                setFormData(prev => ({
                  ...prev,
                  vehicleId: value,
                  vehicleName: vehicle ? `${vehicle.make} ${vehicle.model}` : ''
                }));
              }}
              value={formData.vehicleId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {filteredVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="appointment">Rendez-vous associé</Label>
            <Select 
              onValueChange={(value) => setFormData(prev => ({ ...prev, appointmentId: value }))}
              value={formData.appointmentId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rendez-vous" />
              </SelectTrigger>
              <SelectContent>
                {filteredAppointments.map((appointment) => (
                  <SelectItem key={appointment.id} value={appointment.id}>
                    {new Date(appointment.date).toLocaleDateString()} - {appointment.time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mechanic">Mécanicien</Label>
            <Select 
              onValueChange={(value) => {
                const mechanic = mechanics.find(m => m.id === value);
                setFormData(prev => ({
                  ...prev,
                  mechanicId: value,
                  mechanicName: mechanic ? mechanic.name : ''
                }));
              }}
              value={formData.mechanicId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un mécanicien" />
              </SelectTrigger>
              <SelectContent>
                {mechanics.map((mechanic) => (
                  <SelectItem key={mechanic.id} value={mechanic.id}>
                    {mechanic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="service">Service</Label>
            <Select 
              onValueChange={(value) => {
                const service = services.find(s => s.id === value);
                setFormData(prev => ({
                  ...prev,
                  serviceId: value,
                  serviceName: service ? service.name : ''
                }));
              }}
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

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description de la réparation"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Ajouter la réparation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairDialog;
