
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Trash2 } from "lucide-react";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { toast } from "sonner";
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepairAdded: () => void;
}

interface Service {
  id: string;
  name: string;
  quantity: number;
  cost: number;
}

const AddRepairDialog: React.FC<AddRepairDialogProps> = ({
  open,
  onOpenChange,
  onRepairAdded
}) => {
  const { clients, vehicles, mechanics, services, appointments } = useGarageData();
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [status, setStatus] = useState('pending');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [description, setDescription] = useState('');
  const [repairServices, setRepairServices] = useState<Service[]>([{ 
    id: '', name: '', quantity: 1, cost: 0 
  }]);

  const filteredVehicles = selectedClient 
    ? vehicles.filter(v => v.clientId === selectedClient)
    : [];

  const totalCost = repairServices.reduce((sum, service) => 
    sum + (service.cost * service.quantity), 0);

  const handleAddService = () => {
    setRepairServices([...repairServices, { id: '', name: '', quantity: 1, cost: 0 }]);
  };

  const handleRemoveService = (index: number) => {
    const newServices = [...repairServices];
    newServices.splice(index, 1);
    setRepairServices(newServices);
  };

  const handleServiceChange = (index: number, field: keyof Service, value: any) => {
    const newServices = [...repairServices];
    newServices[index][field] = value;
    
    if (field === 'id') {
      const selectedService = services.find(s => s.id === value);
      if (selectedService) {
        newServices[index].name = selectedService.name;
        newServices[index].cost = selectedService.cost || 0;
      }
    }
    
    setRepairServices(newServices);
  };

  const handleSubmit = async () => {
    try {
      if (!selectedClient || !selectedVehicle || !selectedMechanic || !startDate) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      const selectedClientData = clients.find(c => c.id === selectedClient);
      const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle);
      const selectedMechanicData = mechanics.find(m => m.id === selectedMechanic);

      const repair = {
        clientId: selectedClient,
        clientName: selectedClientData ? `${selectedClientData.firstName} ${selectedClientData.lastName}` : '',
        vehicleId: selectedVehicle,
        vehicleName: selectedVehicleData ? `${selectedVehicleData.make} ${selectedVehicleData.model}` : '',
        mechanicId: selectedMechanic,
        mechanicName: selectedMechanicData ? selectedMechanicData.name : '',
        status,
        date: startDate.toISOString(),
        estimatedEndDate: endDate?.toISOString(),
        description,
        services: repairServices.filter(s => s.id !== ''),
        totalCost,
        createdAt: new Date().toISOString(),
        progress: 0,
      };

      await addDoc(collection(db, COLLECTIONS.GARAGE.REPAIRS), repair);
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
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
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
              <Label>Véhicule</Label>
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
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

            <div className="space-y-2">
              <Label>Mécanicien</Label>
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
              <Label>Statut</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente d'approbation</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Date de début</Label>
              <DatePicker
                date={startDate}
                onSelect={setStartDate}
                placeholder="Sélectionner une date"
              />
            </div>

            <div className="space-y-2">
              <Label>Date de fin estimée</Label>
              <DatePicker
                date={endDate}
                onSelect={setEndDate}
                placeholder="Sélectionner une date"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Services</Label>
              <Button type="button" variant="outline" onClick={handleAddService}>
                + Ajouter un service
              </Button>
            </div>

            {repairServices.map((service, index) => (
              <div key={index} className="grid grid-cols-[2fr,1fr,1fr,auto] gap-2 items-end">
                <div>
                  <Select
                    value={service.id}
                    onValueChange={(value) => handleServiceChange(index, 'id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  type="number"
                  value={service.quantity}
                  onChange={(e) => handleServiceChange(index, 'quantity', parseInt(e.target.value))}
                  min="1"
                />
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    value={service.cost}
                    onChange={(e) => handleServiceChange(index, 'cost', parseFloat(e.target.value))}
                    min="0"
                  />
                  <span>€</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveService(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Coût estimé</Label>
            <Input type="number" value={totalCost} disabled />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <textarea
              className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input"
              placeholder="Détails de la réparation..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
