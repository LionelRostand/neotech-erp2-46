
import React from 'react';
import { useForm } from 'react-hook-form';
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
import { toast } from 'sonner';

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
}

export function AddServiceDialog({ open, onOpenChange, onServiceAdded }: AddServiceDialogProps) {
  const { add } = useFirestore('garage_services');
  const { register, handleSubmit, reset } = useForm<ServiceFormData>();

  const onSubmit = async (data: ServiceFormData) => {
    try {
      await add({
        ...data,
        status: 'active',
        createdAt: new Date().toISOString()
      });
      toast.success('Service ajouté avec succès');
      reset();
      onOpenChange(false);
      onServiceAdded();
    } catch (error) {
      toast.error("Erreur lors de l'ajout du service");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un service</DialogTitle>
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
