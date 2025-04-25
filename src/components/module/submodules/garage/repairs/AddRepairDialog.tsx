
import React, { useState } from 'react';
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

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
}) => {
  const [formData, setFormData] = useState<RepairFormData>(initialFormData);

  const handleChange = (field: keyof RepairFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleServicesChange = (services: RepairService[]) => {
    setFormData(prev => ({ ...prev, services }));
  };

  const handleCostChange = (totalCost: number) => {
    setFormData(prev => ({ ...prev, estimatedCost: totalCost }));
  };

  const handleSubmit = () => {
    console.log('Form data:', formData);
    // Add your submit logic here
    onOpenChange(false);
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
                <SelectItem value="1">Jean Dupont</SelectItem>
                <SelectItem value="2">Marie Martin</SelectItem>
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
                <SelectItem value="1">Peugeot 208</SelectItem>
                <SelectItem value="2">Renault Clio</SelectItem>
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
                <SelectItem value="1">Pierre Dubois</SelectItem>
                <SelectItem value="2">Jacques Martin</SelectItem>
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

          <div className="col-span-2 space-y-2">
            <ServicesSelector
              services={formData.services}
              onChange={handleServicesChange}
              onCostChange={handleCostChange}
            />
          </div>

          <div className="col-span-2 space-y-2">
            <label>Coût estimé (€)</label>
            <Input
              type="number"
              value={formData.estimatedCost}
              disabled
              className="bg-gray-100"
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
