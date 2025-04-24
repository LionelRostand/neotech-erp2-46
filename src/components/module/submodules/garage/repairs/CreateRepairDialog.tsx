
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRepairService } from '@/hooks/garage/useRepairService';
import { useForm } from 'react-hook-form';

interface CreateRepairDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function CreateRepairDialog({ 
  open, 
  onOpenChange,
  onSuccess 
}: CreateRepairDialogProps) {
  const { register, handleSubmit, reset } = useForm();
  const { addRepair } = useRepairService();

  const onSubmit = async (data: any) => {
    const success = await addRepair(data);
    if (success) {
      reset();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouvelle réparation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client</Label>
            <Input id="clientName" {...register('clientName', { required: true })} />
          </div>
          <div>
            <Label htmlFor="vehicleName">Véhicule</Label>
            <Input id="vehicleName" {...register('vehicleName', { required: true })} />
          </div>
          <div>
            <Label htmlFor="mechanicName">Mécanicien</Label>
            <Input id="mechanicName" {...register('mechanicName', { required: true })} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register('description', { required: true })} />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
}
