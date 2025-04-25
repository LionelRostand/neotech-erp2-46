
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from 'react-hook-form';
import { useGarageServicesOperations } from '@/hooks/garage/useGarageServicesOperations';

interface CreateServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
}

export const CreateServiceDialog = ({ open, onOpenChange }: CreateServiceDialogProps) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const { createService } = useGarageServicesOperations();

  const onSubmit = async (data: any) => {
    try {
      await createService({
        name: data.name,
        description: data.description,
        cost: parseFloat(data.cost),
        duration: parseInt(data.duration),
        status: 'active',
      });
      onOpenChange(false);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouveau Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...register('name', { required: true })}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                className="col-span-3"
                {...register('description', { required: true })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost" className="text-right">
                Coût (€)
              </Label>
              <Input
                id="cost"
                type="number"
                className="col-span-3"
                {...register('cost', { required: true, min: 0 })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Durée (min)
              </Label>
              <Input
                id="duration"
                type="number"
                className="col-span-3"
                {...register('duration', { required: true, min: 0 })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
