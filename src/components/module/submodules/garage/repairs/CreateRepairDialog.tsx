
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { clientsMap, vehiclesMap, mechanicsMap } from './repairsData';
import { Repair } from '../types/garage-types';

interface CreateRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  onSave?: (data: any) => void;
}

const CreateRepairDialog = ({ 
  open, 
  onOpenChange,
  onSuccess,
  onSave
}: CreateRepairDialogProps) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data: any) => {
    try {
      // Generate a unique ID for the repair
      const newRepair = {
        id: `repair-${Date.now()}`,
        clientId: data.clientId,
        clientName: clientsMap[data.clientId]?.firstName + ' ' + clientsMap[data.clientId]?.lastName,
        vehicleId: data.vehicleId,
        vehicleName: vehiclesMap[data.vehicleId]?.make + ' ' + vehiclesMap[data.vehicleId]?.model,
        mechanicId: data.mechanicId,
        mechanicName: mechanicsMap[data.mechanicId]?.firstName + ' ' + mechanicsMap[data.mechanicId]?.lastName,
        description: data.description,
        status: 'awaiting_approval',
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        estimatedEndDate: data.estimatedEndDate,
        progress: 0,
        cost: parseFloat(data.cost) || 0,
        parts: [],
        notes: data.notes || '',
        createdAt: new Date().toISOString(),
      };
      
      // If onSave function is provided, call it with the new repair data
      if (onSave) {
        onSave(newRepair);
      } else {
        // In a real app, you'd save to Firestore here
        console.log('Creating new repair:', newRepair);
        toast.success('Réparation créée avec succès');
      }
      
      // Close the dialog and reset the form
      reset();
      onOpenChange(false);
      
      // Trigger the success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating repair:', error);
      toast.error('Erreur lors de la création de la réparation');
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Réparation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="clientId" className="block text-sm font-medium mb-1">Client</label>
              <select 
                id="clientId"
                className="w-full p-2 border rounded"
                {...register("clientId", { required: "Client requis" })}
              >
                <option value="">Sélectionnez un client</option>
                {Object.values(clientsMap).map(client => (
                  <option key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </option>
                ))}
              </select>
              {errors.clientId && <p className="text-sm text-red-500 mt-1">{errors.clientId.message?.toString()}</p>}
            </div>
            
            <div>
              <label htmlFor="vehicleId" className="block text-sm font-medium mb-1">Véhicule</label>
              <select 
                id="vehicleId"
                className="w-full p-2 border rounded"
                {...register("vehicleId", { required: "Véhicule requis" })}
              >
                <option value="">Sélectionnez un véhicule</option>
                {Object.values(vehiclesMap).map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                  </option>
                ))}
              </select>
              {errors.vehicleId && <p className="text-sm text-red-500 mt-1">{errors.vehicleId.message?.toString()}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              id="description"
              className="w-full p-2 border rounded min-h-[100px]"
              {...register("description", { required: "Description requise" })}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message?.toString()}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="mechanicId" className="block text-sm font-medium mb-1">Mécanicien</label>
              <select 
                id="mechanicId"
                className="w-full p-2 border rounded"
                {...register("mechanicId")}
              >
                <option value="">Non assigné</option>
                {Object.values(mechanicsMap).map(mechanic => (
                  <option key={mechanic.id} value={mechanic.id}>
                    {mechanic.firstName} {mechanic.lastName}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="cost" className="block text-sm font-medium mb-1">Coût estimé (€)</label>
              <input 
                type="number" 
                id="cost"
                className="w-full p-2 border rounded"
                {...register("cost", { min: 0 })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium mb-1">Date de début</label>
              <input 
                type="date" 
                id="startDate"
                className="w-full p-2 border rounded"
                {...register("startDate")}
              />
            </div>
            
            <div>
              <label htmlFor="estimatedEndDate" className="block text-sm font-medium mb-1">Date estimée de fin</label>
              <input 
                type="date" 
                id="estimatedEndDate"
                className="w-full p-2 border rounded"
                {...register("estimatedEndDate")}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-1">Notes</label>
            <textarea 
              id="notes"
              className="w-full p-2 border rounded min-h-[80px]"
              {...register("notes")}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
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
