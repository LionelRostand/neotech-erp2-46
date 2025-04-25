
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { RepairFormData, RepairService } from './types';
import ServicesSelector from './ServicesSelector';
import { toast } from 'sonner';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface AddRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRepairAdded?: () => void;
}

const AddRepairDialog: React.FC<AddRepairDialogProps> = ({
  open,
  onOpenChange,
  onRepairAdded,
}) => {
  const { clients, vehicles, mechanics } = useGarageData();
  const [totalCost, setTotalCost] = useState(0);
  const [selectedServices, setSelectedServices] = useState<RepairService[]>([]);

  const form = useForm<RepairFormData>({
    defaultValues: {
      clientId: '',
      vehicleId: '',
      mechanicId: '',
      startDate: new Date().toISOString().split('T')[0],
      estimatedEndDate: '',
      status: 'pending',
      estimatedCost: 0,
      progress: 0,
      description: '',
      services: [],
    },
  });

  const handleSubmit = async (data: RepairFormData) => {
    try {
      const repairData = {
        ...data,
        date: new Date().toISOString(),
        services: selectedServices,
        estimatedCost: totalCost,
        status: 'in_progress',
        progress: 0,
        clientName: clients.find(c => c.id === data.clientId)?.name,
        vehicleName: vehicles.find(v => v.id === data.vehicleId)?.name,
        mechanicName: mechanics.find(m => m.id === data.mechanicId)?.name,
      };

      await addDoc(collection(db, COLLECTIONS.GARAGE.REPAIRS), repairData);
      
      toast.success('Réparation ajoutée avec succès');
      onOpenChange(false);
      if (onRepairAdded) {
        onRepairAdded();
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réparation:', error);
      toast.error('Erreur lors de l\'ajout de la réparation');
    }
  };

  const handleServicesChange = (newServices: RepairService[]) => {
    setSelectedServices(newServices);
  };

  const handleCostChange = (newCost: number) => {
    setTotalCost(newCost);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nouvelle réparation</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Véhicule</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un véhicule" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mechanicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mécanicien</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un mécanicien" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mechanics.map((mechanic) => (
                          <SelectItem key={mechanic.id} value={mechanic.id}>
                            {mechanic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Description de la réparation" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <ServicesSelector
              services={selectedServices}
              onChange={handleServicesChange}
              onCostChange={handleCostChange}
            />

            <div className="bg-muted p-4 rounded-lg">
              <div className="text-lg font-semibold">
                Coût total estimé: {totalCost}€
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Ajouter la réparation
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRepairDialog;
