
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface RepairService {
  serviceId: string;
  quantity: number;
  cost: number;
}

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepairAdded: () => void;
}

export default function AddRepairDialog({ open, onOpenChange, onRepairAdded }: AddRepairDialogProps) {
  const { clients, vehicles, mechanics, services, appointments } = useGarageData();
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [status, setStatus] = useState('pending');
  const [startDate, setStartDate] = useState('');
  const [estimatedEndDate, setEstimatedEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [selectedServices, setSelectedServices] = useState<RepairService[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredVehicles = vehicles.filter(v => v.clientId === selectedClient);

  const totalCost = selectedServices.reduce((sum, service) => {
    return sum + (service.cost * service.quantity);
  }, 0);

  const handleServiceAdd = () => {
    setSelectedServices([...selectedServices, { serviceId: '', quantity: 1, cost: 0 }]);
  };

  const handleServiceRemove = (index: number) => {
    setSelectedServices(selectedServices.filter((_, i) => i !== index));
  };

  const handleServiceChange = (index: number, field: keyof RepairService, value: string | number) => {
    const updatedServices = [...selectedServices];
    if (field === 'serviceId') {
      const service = services.find(s => s.id === value);
      updatedServices[index] = {
        ...updatedServices[index],
        [field]: value,
        cost: service?.cost || 0
      };
    } else {
      updatedServices[index] = {
        ...updatedServices[index],
        [field]: value
      };
    }
    setSelectedServices(updatedServices);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const selectedClientData = clients.find(c => c.id === selectedClient);
      const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
      const selectedMechanicData = mechanics.find(m => m.id === selectedMechanic);

      const repairData = {
        clientId: selectedClient,
        clientName: selectedClientData?.name,
        vehicleId: selectedVehicle,
        vehicleName: selectedVehicleData?.model,
        mechanicId: selectedMechanic,
        mechanicName: selectedMechanicData?.name,
        date: startDate,
        estimatedEndDate,
        status,
        description,
        services: selectedServices,
        progress: 0,
        estimatedCost: totalCost,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, COLLECTIONS.GARAGE.REPAIRS), repairData);
      toast.success('Réparation ajoutée avec succès');
      onRepairAdded();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error adding repair:', error);
      toast.error('Erreur lors de l\'ajout de la réparation');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedClient('');
    setSelectedVehicle('');
    setSelectedMechanic('');
    setStatus('pending');
    setStartDate('');
    setEstimatedEndDate('');
    setDescription('');
    setSelectedServices([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une réparation</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Client</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Véhicule</label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {filteredVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.model} - {vehicle.licensePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Mécanicien</label>
            <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
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

          <div className="space-y-2">
            <label>Statut</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="En attente d'approbation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">En attente d'approbation</SelectItem>
                <SelectItem value="approved">Approuvé</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Date de début</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label>Date de fin estimée</label>
            <Input
              type="date"
              value={estimatedEndDate}
              onChange={(e) => setEstimatedEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Services</h3>
            <Button type="button" variant="outline" onClick={handleServiceAdd}>
              + Ajouter un service
            </Button>
          </div>

          <div className="space-y-4">
            {selectedServices.map((service, index) => (
              <div key={index} className="grid grid-cols-[2fr,1fr,1fr,auto] gap-2 items-end">
                <Select
                  value={service.serviceId}
                  onValueChange={(value) => handleServiceChange(index, 'serviceId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name} - {s.cost}€
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min="1"
                  value={service.quantity}
                  onChange={(e) => handleServiceChange(index, 'quantity', parseInt(e.target.value))}
                  className="w-20"
                />
                <div className="flex items-center">
                  {(service.cost * service.quantity).toFixed(2)}€
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-red-500"
                  onClick={() => handleServiceRemove(index)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <div className="text-lg font-medium">
              Coût estimé: {totalCost.toFixed(2)}€
            </div>
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <label>Description</label>
          <Textarea
            placeholder="Détails de la réparation..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Ajouter la réparation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
