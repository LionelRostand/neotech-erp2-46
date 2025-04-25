
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { useGarageMechanics } from '@/hooks/garage/useGarageMechanics';
import { useGarageServices } from '@/hooks/garage/useGarageServices';
import { useVehicleClientMapping } from '@/hooks/garage/useVehicleClientMapping';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepairAdded: () => void;
}

const AddRepairDialog = ({ open, onOpenChange, onRepairAdded }: AddRepairDialogProps) => {
  const { clients, vehicles } = useGarageData();
  const { mechanics } = useGarageMechanics();
  const { services } = useGarageServices();
  const { getClientForVehicle } = useVehicleClientMapping();
  
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedMechanic, setSelectedMechanic] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');

  const handleVehicleChange = (vehicleId: string) => {
    setSelectedVehicle(vehicleId);
    const clientId = getClientForVehicle(vehicleId);
    setSelectedClient(clientId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const repair = {
        vehicleId: selectedVehicle,
        vehicleName: vehicles.find(v => v.id === selectedVehicle)?.make,
        clientId: selectedClient,
        clientName: clients.find(c => c.id === selectedClient)?.name,
        mechanicId: selectedMechanic,
        mechanicName: mechanics.find(m => m.id === selectedMechanic)?.firstName + ' ' + mechanics.find(m => m.id === selectedMechanic)?.lastName,
        startDate: new Date().toISOString(),
        date: new Date().toISOString(),
        status: 'pending',
        description,
        progress: 0,
        estimatedCost: Number(estimatedCost),
        services: selectedServices,
      };

      await addDoc(collection(db, COLLECTIONS.GARAGE.REPAIRS), repair);
      toast.success('Réparation ajoutée avec succès');
      onRepairAdded();
      onOpenChange(false);
    } catch (error) {
      console.error('Error adding repair:', error);
      toast.error('Erreur lors de l\'ajout de la réparation');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une réparation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Véhicule</Label>
              <Select value={selectedVehicle} onValueChange={handleVehicleChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles?.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Client associé au véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mécanicien</Label>
            <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un mécanicien" />
              </SelectTrigger>
              <SelectContent>
                {mechanics?.map(mechanic => (
                  <SelectItem key={mechanic.id} value={mechanic.id}>
                    {mechanic.firstName} {mechanic.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Services</Label>
            <Select value={selectedServices[0]} onValueChange={(value) => setSelectedServices([value])}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner les services" />
              </SelectTrigger>
              <SelectContent>
                {services?.map(service => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description de la réparation"
            />
          </div>

          <div className="space-y-2">
            <Label>Coût estimé</Label>
            <Input
              type="number"
              value={estimatedCost}
              onChange={(e) => setEstimatedCost(e.target.value)}
              placeholder="Coût estimé en €"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairDialog;
