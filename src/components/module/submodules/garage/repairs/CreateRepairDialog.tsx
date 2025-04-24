
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from 'react-hook-form';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

interface CreateRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  clientsMap?: Record<string, any>;
  vehiclesMap?: Record<string, any>;
  mechanicsMap?: Record<string, any>;
}

const CreateRepairDialog: React.FC<CreateRepairDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  clientsMap = {},
  vehiclesMap = {},
  mechanicsMap = {}
}) => {
  const form = useForm({
    defaultValues: {
      clientId: '',
      clientName: '',
      vehicleId: '',
      vehicleName: '',
      mechanicId: '',
      mechanicName: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0],
      status: 'awaiting_approval',
      progress: 0
    }
  });

  const handleSave = async (data: any) => {
    try {
      console.log('Creating repair:', data);
      
      // In a real app, we would save this to Firestore
      // For now, just show a success message
      
      toast.success('Réparation créée avec succès');
      onOpenChange(false);
      form.reset();
      
      // Trigger refetch if callback exists
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating repair:', error);
      toast.error('Erreur lors de la création de la réparation');
    }
  };

  const handleClientChange = (clientId: string) => {
    const client = clientsMap[clientId] || { id: clientId, name: 'Client inconnu' };
    form.setValue('clientId', clientId);
    form.setValue('clientName', client.name || `${client.firstName || ''} ${client.lastName || ''}`);
  };

  const handleVehicleChange = (vehicleId: string) => {
    const vehicle = vehiclesMap[vehicleId] || { id: vehicleId, name: 'Véhicule inconnu' };
    form.setValue('vehicleId', vehicleId);
    form.setValue('vehicleName', vehicle.name || `${vehicle.make || ''} ${vehicle.model || ''}`);
  };

  const handleMechanicChange = (mechanicId: string) => {
    const mechanic = mechanicsMap[mechanicId] || { id: mechanicId, name: 'Mécanicien inconnu' };
    form.setValue('mechanicId', mechanicId);
    form.setValue('mechanicName', mechanic.name || `${mechanic.firstName || ''} ${mechanic.lastName || ''}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réparation</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
          <div>
            <Label htmlFor="clientId">Client</Label>
            <Select onValueChange={handleClientChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(clientsMap).length > 0 ? (
                  Object.entries(clientsMap).map(([id, client]: [string, any]) => (
                    <SelectItem key={id} value={id}>
                      {client.name || `${client.firstName || ''} ${client.lastName || ''}`}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="dummy">Client non disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="vehicleId">Véhicule</Label>
            <Select onValueChange={handleVehicleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(vehiclesMap).length > 0 ? (
                  Object.entries(vehiclesMap).map(([id, vehicle]: [string, any]) => (
                    <SelectItem key={id} value={id}>
                      {vehicle.name || `${vehicle.make || ''} ${vehicle.model || ''} (${vehicle.licensePlate || 'Sans plaque'})`}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="dummy">Véhicule non disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description de la réparation</Label>
            <Textarea 
              {...form.register('description')} 
              placeholder="Décrivez la réparation à effectuer" 
            />
          </div>

          <div>
            <Label htmlFor="mechanicId">Mécanicien assigné</Label>
            <Select onValueChange={handleMechanicChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un mécanicien" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(mechanicsMap).length > 0 ? (
                  Object.entries(mechanicsMap).map(([id, mechanic]: [string, any]) => (
                    <SelectItem key={id} value={id}>
                      {mechanic.name || `${mechanic.firstName || ''} ${mechanic.lastName || ''}`}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="dummy">Mécanicien non disponible</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="startDate">Date de début</Label>
            <Input 
              type="date" 
              {...form.register('startDate')} 
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Créer réparation</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRepairDialog;
