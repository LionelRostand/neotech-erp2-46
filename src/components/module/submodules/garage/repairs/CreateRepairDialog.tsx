import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Repair } from '../types/garage-types';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface CreateRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (repair: Repair) => void;
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
    progress: 0
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleVehicleChange = (vehicleId: string) => {
    const selectedVehicle = vehicles.find(v => v.id === vehicleId);
    const selectedClient = clients.find(c => c.id === selectedVehicle?.clientId);
    
    setFormData(prev => ({
      ...prev,
      vehicleId,
      clientId: selectedClient?.id || '',
      clientName: selectedClient ? `${selectedClient.firstName} ${selectedClient.lastName}` : '',
      vehicleName: `${selectedVehicle?.brand} ${selectedVehicle?.model}`,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newRepair = {
        ...formData,
        createdAt: new Date().toISOString(),
        status: 'pending',
        progress: 0
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, COLLECTIONS.GARAGE.REPAIRS), newRepair);
      const savedRepair = { ...newRepair, id: docRef.id } as Repair;
      
      toast.success('Réparation créée avec succès');
      if (onSave) onSave(savedRepair);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating repair:', error);
      toast.error('Erreur lors de la création de la réparation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle réparation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            {/* Vehicle Selection */}
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
                      {vehicle.brand} {vehicle.model} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* License Plate */}
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Immatriculation</Label>
              <Input
                id="licensePlate"
                value={formData.licensePlate || ''}
                readOnly
                className="bg-gray-100"
              />
            </div>

            {/* Service Selection */}
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

            {/* Mechanic Selection */}
            <div className="space-y-2">
              <Label htmlFor="mechanic">Mécanicien</Label>
              <Select
                value={formData.mechanicId}
                onValueChange={(value) => {
                  const selectedMechanic = mechanics.find(m => m.id === value);
                  setFormData(prev => ({
                    ...prev,
                    mechanicId: value,
                    mechanicName: selectedMechanic?.name || ''
                  }));
                }}
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

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description de la réparation"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création...' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRepairDialog;
