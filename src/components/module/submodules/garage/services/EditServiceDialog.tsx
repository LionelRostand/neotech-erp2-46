
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";

interface Service {
  id: string;
  name: string;
  description: string;
  cost: number;
  duration: number;
  status: string;
  createdAt: string;
}

interface EditServiceDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceUpdated: () => void;
}

interface ServiceFormData {
  name: string;
  description: string;
  cost: number;
  duration: number;
  status: string;
}

export function EditServiceDialog({ service, open, onOpenChange, onServiceUpdated }: EditServiceDialogProps) {
  const { update } = useFirestore('garage_services');
  const { register, handleSubmit, reset, setValue, watch } = useForm<ServiceFormData>();

  const status = watch('status', service.status);

  useEffect(() => {
    if (service) {
      reset({
        name: service.name,
        description: service.description,
        cost: service.cost,
        duration: service.duration,
        status: service.status
      });
    }
  }, [service, reset]);

  const onSubmit = async (data: ServiceFormData) => {
    try {
      console.log("Updating service:", service.id, data);
      await update(service.id, {
        ...data,
        updatedAt: new Date().toISOString()
      });
      toast.success('Service mis à jour avec succès');
      onOpenChange(false);
      onServiceUpdated();
    } catch (error: any) {
      console.error("Error updating service:", error);
      toast.error(`Erreur lors de la mise à jour du service: ${error.message}`);
    }
  };

  const handleStatusChange = (value: string) => {
    setValue('status', value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le service</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du service</Label>
            <Input
              id="name"
              {...register("name", { required: true })}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
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
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Durée (min)</Label>
              <Input
                id="duration"
                type="number"
                {...register("duration", { required: true, min: 0 })}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Statut</Label>
            <Select 
              value={status} 
              onValueChange={handleStatusChange}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
