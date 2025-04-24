
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { toast } from 'sonner';

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
  const { addVehicle } = useGarageVehicles();
  const { clients, loading: clientsLoading } = useGarageClients();
  const [formData, setFormData] = React.useState({
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
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.make || !formData.model || !formData.licensePlate || !formData.clientId) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsSubmitting(true);
    try {
      await addVehicle(formData);
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
    } finally {
      setIsSubmitting(false);
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
                {clientsLoading ? (
                  <SelectItem value="loading" disabled>Chargement des clients...</SelectItem>
                ) : clients.length === 0 ? (
                  <SelectItem value="empty" disabled>Aucun client disponible</SelectItem>
                ) : (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </SelectItem>
                  ))
                )}
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
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'En cours...' : 'Ajouter le véhicule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;
