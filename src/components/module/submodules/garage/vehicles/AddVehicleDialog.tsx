import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { useGarageVehiclesOperations } from '@/hooks/garage/useGarageVehiclesOperations';

interface AddVehicleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleAdded: () => void;
}

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
  isOpen,
  onOpenChange,
  onVehicleAdded
}) => {
  const { createVehicle } = useGarageVehiclesOperations();
  const { clients } = useGarageClients();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    clientId: '',
    services: [],
    repairs: [],
    status: 'available' as const,
    mileage: 0,
    lastCheckDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await createVehicle(formData);
      onVehicleAdded();
      onOpenChange(false);
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        clientId: '',
        services: [],
        repairs: [],
        status: 'available',
        mileage: 0,
        lastCheckDate: ''
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du véhicule:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau Véhicule</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="make">Marque *</Label>
            <Input
              id="make"
              name="make"
              value={formData.make}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Modèle *</Label>
            <Input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Année *</Label>
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
            <Label htmlFor="licensePlate">Immatriculation *</Label>
            <Input
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mileage">Kilométrage *</Label>
            <Input
              id="mileage"
              name="mileage"
              type="number"
              value={formData.mileage}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientId">Client *</Label>
            <Select 
              value={formData.clientId} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
            >
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
            <Label htmlFor="lastCheckDate">Dernier contrôle</Label>
            <Input
              id="lastCheckDate"
              name="lastCheckDate"
              type="date"
              value={formData.lastCheckDate}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Ajouter le véhicule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;
