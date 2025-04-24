
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';
import { useGarageClients } from '@/hooks/garage/useGarageClients';

interface EditVehicleDialogProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (vehicleId: string, data: Partial<Vehicle>) => Promise<void>;
}

const EditVehicleDialog: React.FC<EditVehicleDialogProps> = ({
  vehicle,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { clients } = useGarageClients();
  const [formData, setFormData] = React.useState<Partial<Vehicle>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    }
  }, [vehicle]);

  if (!vehicle) return null;

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onUpdate(vehicle.id, formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: keyof Vehicle, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le véhicule</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="make">Marque</Label>
            <Input
              id="make"
              value={formData.make || ''}
              onChange={e => handleChange('make', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model">Modèle</Label>
            <Input
              id="model"
              value={formData.model || ''}
              onChange={e => handleChange('model', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Année</Label>
            <Input
              id="year"
              type="number"
              value={formData.year || ''}
              onChange={e => handleChange('year', parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="licensePlate">Immatriculation</Label>
            <Input
              id="licensePlate"
              value={formData.licensePlate || ''}
              onChange={e => handleChange('licensePlate', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mileage">Kilométrage</Label>
            <Input
              id="mileage"
              type="number"
              value={formData.mileage || ''}
              onChange={e => handleChange('mileage', parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={value => handleChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponible</SelectItem>
                <SelectItem value="maintenance">En maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientId">Client</Label>
            <Select 
              value={formData.clientId} 
              onValueChange={value => handleChange('clientId', value)}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleDialog;
