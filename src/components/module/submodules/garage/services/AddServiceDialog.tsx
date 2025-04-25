
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { MechanicSelector } from '../repairs/components/MechanicSelector';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore } from '@/hooks/useFirestore';

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceAdded: () => void;
}

interface ServiceFormData {
  name: string;
  description: string;
  cost: number;
  duration: number;
  status: string;
  mechanicId: string;
}

export function AddServiceDialog({ open, onOpenChange, onServiceAdded }: AddServiceDialogProps) {
  const { add } = useFirestore('garage_services');
  const { register, handleSubmit, reset, setValue, watch } = useForm<ServiceFormData>({
    defaultValues: {
      name: '',
      description: '',
      cost: 0,
      duration: 0,
      status: 'active',
      mechanicId: ''
    }
  });

  const onSubmit = async (data: ServiceFormData) => {
    try {
      await add({
        ...data,
        createdAt: new Date().toISOString()
      });
      toast.success('Service ajouté avec succès');
      reset();
      onOpenChange(false);
      onServiceAdded();
    } catch (error: any) {
      console.error("Error adding service:", error);
      toast.error(`Erreur lors de l'ajout du service: ${error.message}`);
    }
  };

  const handleMechanicChange = (mechanicId: string) => {
    setValue('mechanicId', mechanicId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du service</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
              placeholder="Ex: Changement d'huile"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Description détaillée du service"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="cost">Coût (€)</Label>
              <Input
                id="cost"
                type="number"
                {...register("cost", { required: true, min: 0 })}
                placeholder="45"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Durée (min)</Label>
              <Input
                id="duration"
                type="number"
                {...register("duration", { required: true, min: 0 })}
                placeholder="60"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="mechanic">Mécanicien</Label>
            <MechanicSelector
              value={watch('mechanicId')}
              onChange={handleMechanicChange}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Ajouter</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

