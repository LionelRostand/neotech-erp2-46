import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { useGarageServices } from '@/hooks/garage/useGarageServices';
import { toast } from 'sonner';

interface CreateRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const CreateRepairDialog = ({ open, onOpenChange, onSuccess }: CreateRepairDialogProps) => {
  const { clients } = useGarageClients();
  const { vehicles } = useGarageVehicles();
  const { services } = useGarageServices();
  const [selectedClient, setSelectedClient] = React.useState('');
  const [selectedVehicle, setSelectedVehicle] = React.useState('');
  const [selectedService, setSelectedService] = React.useState('');
  const [description, setDescription] = React.useState('');

  const filteredVehicles = vehicles.filter(v => v.clientId === selectedClient);
  const selectedServiceData = services.find(s => s.id === selectedService);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !selectedVehicle || !selectedService) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }

    try {
      // TODO: Implement repair creation logic
      toast.success("Réparation créée avec succès");
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la création de la réparation:', error);
      toast.error("Erreur lors de la création de la réparation");
    }
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : '';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réparation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
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
                value={selectedVehicle} 
                onValueChange={setSelectedVehicle}
                disabled={!selectedClient}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {filteredVehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Type de service</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedCost">Coût estimé (€)</Label>
              <Input 
                id="estimatedCost" 
                type="number" 
                value={selectedServiceData?.price || ''} 
                disabled 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de la réparation"
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
