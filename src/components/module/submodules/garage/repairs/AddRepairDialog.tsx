
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Repair } from '@/components/module/submodules/garage/types/garage-types';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepairAdded?: () => void;
}

const AddRepairDialog = ({ open, onOpenChange, onRepairAdded }: AddRepairDialogProps) => {
  const { addRepair, clients, vehicles, mechanics } = useGarageData();
  const { register, handleSubmit, setValue, reset, watch } = useForm<Repair>();

  const onSubmit = async (data: Partial<Repair>) => {
    try {
      const vehicleInfo = vehicles.find(v => v.id === data.vehicleId);
      const clientInfo = clients.find(c => c.id === data.clientId);
      const mechanicInfo = mechanics.find(m => m.id === data.mechanicId);

      const repairData = {
        ...data,
        date: new Date().toISOString(),
        progress: 0,
        status: 'pending',
        vehicleName: vehicleInfo ? `${vehicleInfo.make} ${vehicleInfo.model}` : undefined,
        clientName: clientInfo?.name,
        mechanicName: mechanicInfo ? `${mechanicInfo.firstName} ${mechanicInfo.lastName}` : undefined,
      };

      await addRepair.mutateAsync(repairData);
      reset();
      onOpenChange(false);
      if (onRepairAdded) {
        onRepairAdded();
      }
    } catch (error) {
      console.error('Error adding repair:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réparation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Client</label>
              <Select onValueChange={(value) => setValue('clientId', value)}>
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

            <div>
              <label className="text-sm font-medium">Véhicule</label>
              <Select onValueChange={(value) => setValue('vehicleId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} - {vehicle.licensePlate}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Mécanicien</label>
              <Select onValueChange={(value) => setValue('mechanicId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mécanicien" />
                </SelectTrigger>
                <SelectContent>
                  {mechanics.map((mechanic) => (
                    <SelectItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.firstName} {mechanic.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                {...register('description')}
                placeholder="Description de la réparation"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Coût estimé</label>
              <Input
                type="number"
                {...register('estimatedCost', { valueAsNumber: true })}
                placeholder="Coût estimé"
              />
            </div>

          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairDialog;
