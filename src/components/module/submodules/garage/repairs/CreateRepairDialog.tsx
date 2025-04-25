import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/patched-select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Repair } from '../types/garage-types';
import { useGarageData } from '@/hooks/garage/useGarageData';

interface CreateRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (repair: Partial<Repair>) => void;
}

const CreateRepairDialog: React.FC<CreateRepairDialogProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const { clients = [], vehicles = [], mechanics = [], services = [] } = useGarageData();
  const [formData, setFormData] = React.useState<Partial<Repair>>({
    startDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    description: '',
    estimatedCost: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleVehicleChange = (vehicleId: string) => {
    const selectedVehicle = vehicles.find(v => v.id === vehicleId);
    setFormData(prev => ({
      ...prev,
      vehicleId,
      licensePlate: selectedVehicle?.licensePlate || ''
    }));
  };

  const handleServiceChange = (serviceId: string) => {
    const selectedService = services.find(s => s.id === serviceId);
    setFormData(prev => ({
      ...prev,
      serviceId,
      estimatedCost: selectedService?.price || prev.estimatedCost
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réparation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select 
                value={formData.clientId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
              >
                <SelectTrigger id="client">
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
                value={formData.vehicleId}
                onValueChange={handleVehicleChange}
              >
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">Immatriculation</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate || ''}
                readOnly
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service</Label>
              <Select
                value={formData.serviceId}
                onValueChange={handleServiceChange}
              >
                <SelectTrigger id="service">
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({service.price}€)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mechanic">Mécanicien</Label>
              <Select
                value={formData.mechanicId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, mechanicId: value }))}
              >
                <SelectTrigger id="mechanic">
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Coût estimé (€)</Label>
              <Input
                id="estimatedCost"
                type="number"
                min="0"
                step="0.01"
                value={formData.estimatedCost}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: Number(e.target.value) }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRepairDialog;
