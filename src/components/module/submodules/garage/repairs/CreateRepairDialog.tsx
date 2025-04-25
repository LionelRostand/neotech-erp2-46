
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { GarageClient, Vehicle, Mechanic, Repair } from '@/components/module/submodules/garage/types/garage-types';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from 'sonner';

interface CreateRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (repair: Partial<Repair>) => void;
  clientsMap?: Record<string, GarageClient>;
  vehiclesMap?: Record<string, Vehicle>;
  mechanicsMap?: Record<string, Mechanic>;
}

const CreateRepairDialog = ({ 
  open, 
  onOpenChange, 
  onSave,
  clientsMap: propClientsMap,
  vehiclesMap: propVehiclesMap,
  mechanicsMap: propMechanicsMap
}: CreateRepairDialogProps) => {
  const { clients = [], vehicles = [], mechanics = [] } = useGarageData();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  
  // Initialize maps from props or build from data
  const clientsMap = propClientsMap || clients.reduce<Record<string, GarageClient>>(
    (acc, client) => ({ ...acc, [client.id]: client }), {}
  );
  
  const vehiclesMap = propVehiclesMap || vehicles.reduce<Record<string, Vehicle>>(
    (acc, vehicle) => ({ ...acc, [vehicle.id]: vehicle }), {}
  );
  
  const mechanicsMap = propMechanicsMap || mechanics.reduce<Record<string, Mechanic>>(
    (acc, mechanic) => ({ ...acc, [mechanic.id]: mechanic }), {}
  );

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<Partial<Repair>>({
    defaultValues: {
      status: 'pending',
      progress: 0,
    }
  });

  const selectedVehicleId = watch('vehicleId');
  
  // Update license plate automatically when vehicle changes
  React.useEffect(() => {
    if (selectedVehicleId && vehiclesMap[selectedVehicleId]) {
      setValue('licensePlate', vehiclesMap[selectedVehicleId].licensePlate);
    }
  }, [selectedVehicleId, vehiclesMap, setValue]);

  const onSubmit = (data: Partial<Repair>) => {
    // Format dates for the API
    const formattedData: Partial<Repair> = {
      ...data,
      startDate: startDate ? startDate.toISOString().split('T')[0] : '',
      endDate: endDate ? endDate.toISOString().split('T')[0] : '',
      createdAt: new Date().toISOString(),
      // Add client, vehicle, and mechanic names for display purposes
      clientName: data.clientId ? `${clientsMap[data.clientId]?.firstName} ${clientsMap[data.clientId]?.lastName}` : '',
      vehicleName: data.vehicleId ? `${vehiclesMap[data.vehicleId]?.brand} ${vehiclesMap[data.vehicleId]?.model}` : '',
      mechanicName: data.mechanicId ? mechanicsMap[data.mechanicId]?.name : '',
    };
    
    onSave(formattedData);
    reset();
    setStartDate(undefined);
    setEndDate(undefined);
    onOpenChange(false);
  };

  const handleCancel = () => {
    reset();
    setStartDate(undefined);
    setEndDate(undefined);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle réparation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Field */}
            <div className="space-y-2">
              <Label htmlFor="clientId">Client</Label>
              <Select 
                onValueChange={(value) => setValue('clientId', value)}
              >
                <SelectTrigger id="clientId">
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
              {errors.clientId && <p className="text-sm text-red-500">Le client est requis</p>}
            </div>
            
            {/* Vehicle Field */}
            <div className="space-y-2">
              <Label htmlFor="vehicleId">Véhicule</Label>
              <Select 
                onValueChange={(value) => setValue('vehicleId', value)}
              >
                <SelectTrigger id="vehicleId">
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle) => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.brand} {vehicle.model} ({vehicle.year})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehicleId && <p className="text-sm text-red-500">Le véhicule est requis</p>}
            </div>
            
            {/* License Plate Field - read-only, filled automatically */}
            <div className="space-y-2">
              <Label htmlFor="licensePlate">Immatriculation</Label>
              <Input
                id="licensePlate"
                {...register('licensePlate')}
                readOnly
                className="bg-gray-100"
              />
            </div>
            
            {/* Mechanic Field */}
            <div className="space-y-2">
              <Label htmlFor="mechanicId">Mécanicien</Label>
              <Select 
                onValueChange={(value) => setValue('mechanicId', value)}
              >
                <SelectTrigger id="mechanicId">
                  <SelectValue placeholder="Sélectionner un mécanicien" />
                </SelectTrigger>
                <SelectContent>
                  {mechanics.map((mechanic) => (
                    <SelectItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.name} ({mechanic.specialization})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.mechanicId && <p className="text-sm text-red-500">Le mécanicien est requis</p>}
            </div>
            
            {/* Start Date Field */}
            <div className="space-y-2">
              <Label>Date de début</Label>
              <DatePicker
                date={startDate}
                onSelect={setStartDate}
                placeholder="Sélectionnez une date"
              />
            </div>
            
            {/* End Date Field */}
            <div className="space-y-2">
              <Label>Date de fin</Label>
              <DatePicker
                date={endDate}
                onSelect={setEndDate}
                placeholder="Sélectionnez une date"
              />
            </div>
          </div>
          
          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Détails de la réparation à effectuer"
              {...register('description', { required: true })}
            />
            {errors.description && <p className="text-sm text-red-500">La description est requise</p>}
          </div>
          
          {/* Estimated Cost Field */}
          <div className="space-y-2">
            <Label htmlFor="estimatedCost">Coût estimé (€)</Label>
            <Input
              id="estimatedCost"
              type="number"
              min="0"
              step="0.01"
              {...register('estimatedCost', { 
                valueAsNumber: true,
                required: true 
              })}
            />
            {errors.estimatedCost && <p className="text-sm text-red-500">Le coût estimé est requis</p>}
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Annuler
            </Button>
            <Button type="submit">
              Créer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRepairDialog;
