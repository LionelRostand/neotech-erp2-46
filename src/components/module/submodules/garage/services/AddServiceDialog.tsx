
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ServiceFormData {
  name: string;
  description: string;
  cost: number;
  duration: number;
  canBeUsedIn: {
    vehicles: boolean;
    appointments: boolean;
    repairs: boolean;
    invoices: boolean;
    mechanics: boolean;
    suppliers: boolean;
    inventory: boolean;
  };
}

export function AddServiceDialog({ open, onOpenChange }: AddServiceDialogProps) {
  const { add } = useFirestore('garage_services');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ServiceFormData>({
    defaultValues: {
      canBeUsedIn: {
        vehicles: false,
        appointments: false,
        repairs: false,
        invoices: false,
        mechanics: false,
        suppliers: false,
        inventory: false
      }
    }
  });

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
    } catch (error) {
      toast.error("Erreur lors de l'ajout du service");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du service</Label>
            <Input
              id="name"
              {...register("name", { required: "Ce champ est requis" })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
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
                {...register("cost", { required: "Ce champ est requis" })}
              />
              {errors.cost && (
                <p className="text-sm text-destructive">{errors.cost.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Durée (min)</Label>
              <Input
                id="duration"
                type="number"
                {...register("duration", { required: "Ce champ est requis" })}
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Ce service peut être utilisé dans :</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="vehicles" {...register("canBeUsedIn.vehicles")} />
                <Label htmlFor="vehicles">Véhicules</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="appointments" {...register("canBeUsedIn.appointments")} />
                <Label htmlFor="appointments">Rendez-vous</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="repairs" {...register("canBeUsedIn.repairs")} />
                <Label htmlFor="repairs">Réparations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="invoices" {...register("canBeUsedIn.invoices")} />
                <Label htmlFor="invoices">Factures</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="mechanics" {...register("canBeUsedIn.mechanics")} />
                <Label htmlFor="mechanics">Mécaniciens</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="suppliers" {...register("canBeUsedIn.suppliers")} />
                <Label htmlFor="suppliers">Fournisseurs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="inventory" {...register("canBeUsedIn.inventory")} />
                <Label htmlFor="inventory">Inventaire</Label>
              </div>
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
