
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Vehicle, VehicleType, VehicleStatus } from '../../types/rental-types';

interface CreateVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleCreated: (vehicle: Vehicle) => void;
}

const CreateVehicleDialog: React.FC<CreateVehicleDialogProps> = ({
  isOpen,
  onClose,
  onVehicleCreated
}) => {
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    type: 'sedan' as VehicleType,
    dailyRate: 50,
    mileage: 0,
    features: [] as string[],
    locationId: 'loc1',
    status: 'available' as VehicleStatus,
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create a new vehicle object
    const newVehicle: Vehicle = {
      id: `v${Date.now()}`,
      brand: formData.brand,
      model: formData.model,
      year: formData.year,
      licensePlate: formData.licensePlate,
      type: formData.type,
      status: formData.status,
      dailyRate: formData.dailyRate,
      mileage: formData.mileage,
      features: formData.features,
      locationId: formData.locationId,
      notes: formData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    onVehicleCreated(newVehicle);
    onClose();
    
    // Reset form
    setFormData({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      type: 'sedan' as VehicleType,
      dailyRate: 50,
      mileage: 0,
      features: [],
      locationId: 'loc1',
      status: 'available' as VehicleStatus,
      description: ''
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Marque</Label>
              <Input
                id="brand"
                name="brand"
                placeholder="Renault, Peugeot, etc."
                value={formData.brand}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Modèle</Label>
              <Input
                id="model"
                name="model"
                placeholder="Clio, 308, etc."
                value={formData.model}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Année</Label>
              <Input
                id="year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Immatriculation</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                placeholder="AB-123-CD"
                value={formData.licensePlate}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dailyRate">Tarif journalier (€)</Label>
              <Input
                id="dailyRate"
                name="dailyRate"
                type="number"
                value={formData.dailyRate}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type de véhicule</Label>
              <Select 
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedan">Berline</SelectItem>
                  <SelectItem value="suv">SUV</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="van">Utilitaire</SelectItem>
                  <SelectItem value="luxury">Luxe</SelectItem>
                  <SelectItem value="electric">Électrique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value as VehicleStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="rented">Loué</SelectItem>
                  <SelectItem value="maintenance">En maintenance</SelectItem>
                  <SelectItem value="reserved">Réservé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mileage">Kilométrage</Label>
              <Input
                id="mileage"
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Description et observations sur l'état du véhicule"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Ajouter le véhicule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVehicleDialog;
