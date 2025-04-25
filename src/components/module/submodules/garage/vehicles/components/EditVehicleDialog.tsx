
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';
import { toast } from 'sonner';

interface EditVehicleDialogProps {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditVehicleDialog: React.FC<EditVehicleDialogProps> = ({
  vehicle,
  open,
  onOpenChange,
  onSuccess
}) => {
  const [formData, setFormData] = React.useState<Partial<Vehicle>>({});
  const { updateVehicle } = useGarageVehicles();

  React.useEffect(() => {
    if (vehicle) {
      setFormData(vehicle);
    }
  }, [vehicle]);

  if (!vehicle) return null;

  const handleSubmit = async () => {
    try {
      await updateVehicle(vehicle.id, formData);
      toast.success('Véhicule mis à jour avec succès');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du véhicule');
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Modifier le véhicule</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="make">Marque</Label>
            <Input
              id="make"
              name="make"
              value={formData.make || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Modèle</Label>
            <Input
              id="model"
              name="model"
              value={formData.model || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="licensePlate">Immatriculation</Label>
            <Input
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mileage">Kilométrage</Label>
            <Input
              id="mileage"
              name="mileage"
              type="number"
              value={formData.mileage || ''}
              onChange={handleChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleDialog;
