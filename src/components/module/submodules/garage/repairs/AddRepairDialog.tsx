
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useFirestore } from '@/hooks/useFirestore';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface RepairFormData {
  clientName: string;
  vehicleInfo: string;
  description: string;
  mechanicName: string;
  status: string;
  startDate: string;
  estimatedEndDate: string;
  cost: string;
  progress: string;
}

export function AddRepairDialog({ open, onOpenChange, onSuccess }: AddRepairDialogProps) {
  const { add } = useFirestore(COLLECTIONS.GARAGE.REPAIRS);
  const { 
    clients = [], 
    vehicles = [], 
    mechanics = [],
    services = []
  } = useGarageData();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RepairFormData>({
    defaultValues: {
      status: 'pending',
      progress: '0'
    }
  });

  const onSubmit = async (data: RepairFormData) => {
    try {
      await add({
        ...data,
        progress: parseInt(data.progress),
        cost: parseFloat(data.cost),
        createdAt: new Date().toISOString()
      });
      toast.success('Réparation ajoutée avec succès');
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la réparation");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter une réparation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="clientName">Client</Label>
              <Select onValueChange={(value) => register("clientName").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client: any) => (
                    <SelectItem key={client.id} value={client.name || `${client.firstName} ${client.lastName}`}>
                      {client.name || `${client.firstName} ${client.lastName}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="vehicleInfo">Véhicule</Label>
              <Select onValueChange={(value) => register("vehicleInfo").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((vehicle: any) => (
                    <SelectItem key={vehicle.id} value={`${vehicle.make} ${vehicle.model}`}>
                      {vehicle.make} {vehicle.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              {...register("description", { required: "Ce champ est requis" })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="mechanicName">Mécanicien</Label>
              <Select onValueChange={(value) => register("mechanicName").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un mécanicien" />
                </SelectTrigger>
                <SelectContent>
                  {mechanics.map((mechanic: any) => (
                    <SelectItem key={mechanic.id} value={`${mechanic.firstName} ${mechanic.lastName}`}>
                      {mechanic.firstName} {mechanic.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Statut</Label>
              <Select onValueChange={(value) => register("status").onChange({ target: { value } })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="in_progress">En cours</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate", { required: "Ce champ est requis" })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estimatedEndDate">Date de fin estimée</Label>
              <Input
                id="estimatedEndDate"
                type="date"
                {...register("estimatedEndDate")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cost">Coût estimé (€)</Label>
              <Input
                id="cost"
                type="number"
                {...register("cost")}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="progress">Progression (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                {...register("progress")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
