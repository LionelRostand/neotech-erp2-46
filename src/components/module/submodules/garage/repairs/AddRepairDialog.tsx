
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ServicesSelector from './ServicesSelector';
import { RepairFormData, RepairService } from './types';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { toast } from 'sonner';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepairAdded?: () => void;
}

const initialFormData: RepairFormData = {
  clientId: '',
  vehicleId: '',
  mechanicId: '',
  startDate: new Date().toISOString().split('T')[0],
  estimatedEndDate: '',
  status: 'awaiting_approval',
  estimatedCost: 0,
  progress: 0,
  description: '',
  services: [],
};

const AddRepairDialog: React.FC<AddRepairDialogProps> = ({
  open,
  onOpenChange,
  onRepairAdded
}) => {
  const [formData, setFormData] = useState<RepairFormData>(initialFormData);
  const { clients, vehicles, mechanics, services } = useGarageData();

  const handleChange = (field: keyof RepairFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServicesChange = (services: RepairService[]) => {
    setFormData(prev => ({ ...prev, services }));
    
    // Calculate total cost from services
    const totalCost = services.reduce((sum, service) => sum + (service.cost || 0), 0);
    handleChange('estimatedCost', totalCost);
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const handleSubmit = async () => {
    try {
      // Get client and vehicle names for display
      const selectedClient = clients.find(c => c.id === formData.clientId);
      const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
      const selectedMechanic = mechanics.find(m => m.id === formData.mechanicId);

      const repairData = {
        ...formData,
        date: formData.startDate,
        clientName: selectedClient?.name || 'Unknown Client',
        vehicleName: selectedVehicle?.name || 'Unknown Vehicle',
        vehicleInfo: selectedVehicle?.model || '',
        mechanicName: selectedMechanic?.name || 'Unknown Mechanic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const repairsRef = collection(db, COLLECTIONS.GARAGE.REPAIRS);
      await addDoc(repairsRef, repairData);
      
      toast.success('Réparation ajoutée avec succès');
      if (onRepairAdded) {
        onRepairAdded();
      }
      onOpenChange(false);
      resetForm();
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label>Client</label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => handleChange('clientId', value)}
            >
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
            <Select
              value={formData.vehicleId}
              onValueChange={(value) => handleChange('vehicleId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.name || vehicle.model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Mécanicien</label>
            <Select
              value={formData.mechanicId}
              onValueChange={(value) => handleChange('mechanicId', value)}
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

          <div className="space-y-2">
            <label>Statut</label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="awaiting_approval">En attente d'approbation</SelectItem>
                <SelectItem value="in_progress">En cours</SelectItem>
                <SelectItem value="awaiting_parts">En attente de pièces</SelectItem>
                <SelectItem value="completed">Terminé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label>Date de début</label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label>Date de fin estimée</label>
            <Input
              type="date"
              value={formData.estimatedEndDate}
              onChange={(e) => handleChange('estimatedEndDate', e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <ServicesSelector
              services={formData.services}
              onChange={handleServicesChange}
              availableServices={services}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label>Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Détails de la réparation..."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
            Ajouter la réparation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairDialog;
