
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { useGarageVehiclesByClient } from '@/hooks/garage/useGarageVehiclesByClient';
import { Textarea } from "@/components/ui/textarea";

interface CreateRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const CreateRepairDialog: React.FC<CreateRepairDialogProps> = ({
  open,
  onOpenChange,
  onSubmit
}) => {
  const [formData, setFormData] = React.useState({
    clientId: '',
    vehicleId: '',
    description: '',
    estimatedTime: '',
    status: 'pending' as const
  });

  const { clients } = useGarageClients();
  const { clientVehicles } = useGarageVehiclesByClient(formData.clientId);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset vehicle selection when client changes
      ...(name === 'clientId' ? { vehicleId: '' } : {})
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onOpenChange(false);
    setFormData({
      clientId: '',
      vehicleId: '',
      description: '',
      estimatedTime: '',
      status: 'pending'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Réparation</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select 
              value={formData.clientId}
              onValueChange={(value) => handleInputChange('clientId', value)}
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
            <Label htmlFor="vehicle">Véhicule</Label>
            <Select
              value={formData.vehicleId}
              onValueChange={(value) => handleInputChange('vehicleId', value)}
              disabled={!formData.clientId}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.clientId ? "Sélectionner un véhicule" : "Sélectionnez d'abord un client"} />
              </SelectTrigger>
              <SelectContent>
                {clientVehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedTime">Temps estimé (heures)</Label>
            <Input
              id="estimatedTime"
              type="number"
              value={formData.estimatedTime}
              onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!formData.clientId || !formData.vehicleId || !formData.description}
          >
            Créer la réparation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRepairDialog;
