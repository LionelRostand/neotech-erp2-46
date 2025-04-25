
import React from 'react';
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
import { GarageService } from '../types/garage-types';
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';

interface EditServiceDialogProps {
  service: GarageService | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceUpdated: () => void;
}

const EditServiceDialog: React.FC<EditServiceDialogProps> = ({
  service,
  open,
  onOpenChange,
  onServiceUpdated,
}) => {
  const { update } = useFirestore('garage_services');
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: service || {}
  });

  const onSubmit = async (data: Partial<GarageService>) => {
    if (!service?.id) return;
    try {
      await update(service.id, data);
      toast.success('Service mis à jour avec succès');
      onServiceUpdated();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du service');
    }
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Nom</label>
            <Input {...register('name')} defaultValue={service.name} />
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Input {...register('description')} defaultValue={service.description} />
          </div>
          <div>
            <label className="text-sm font-medium">Coût (€)</label>
            <Input
              type="number"
              {...register('cost')}
              defaultValue={service.cost}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Durée (minutes)</label>
            <Input
              type="number"
              {...register('duration')}
              defaultValue={service.duration}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditServiceDialog;
