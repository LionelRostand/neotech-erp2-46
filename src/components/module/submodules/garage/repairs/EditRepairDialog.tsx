
import React from 'react';
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
import { useFirestore } from '@/hooks/useFirestore';
import { toast } from 'sonner';
import { Repair } from '../../types/garage-types';

interface EditRepairDialogProps {
  repair: Repair | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

const EditRepairDialog = ({
  repair,
  open,
  onOpenChange,
  onUpdate
}: EditRepairDialogProps) => {
  const { update } = useFirestore('garage_repairs');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!repair?.id) return;

    const formData = new FormData(event.currentTarget);
    const updatedRepair = {
      clientName: formData.get('clientName')?.toString() || '',
      vehicleInfo: formData.get('vehicleInfo')?.toString() || '',
      description: formData.get('description')?.toString() || '',
      mechanicName: formData.get('mechanicName')?.toString() || '',
      progress: parseInt(formData.get('progress')?.toString() || '0', 10),
      status: formData.get('status')?.toString() || 'en_cours',
      updatedAt: new Date().toISOString()
    };

    try {
      await update(repair.id, updatedRepair);
      toast.success('Réparation mise à jour avec succès');
      onOpenChange(false);
      onUpdate();
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error(`Erreur lors de la mise à jour: ${error.message}`);
    }
  };

  if (!repair) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la réparation</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clientName">Client</Label>
            <Input id="clientName" name="clientName" defaultValue={repair.clientName} required />
          </div>

          <div>
            <Label htmlFor="vehicleInfo">Véhicule</Label>
            <Input id="vehicleInfo" name="vehicleInfo" defaultValue={repair.vehicleInfo} required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" defaultValue={repair.description} required />
          </div>

          <div>
            <Label htmlFor="mechanicName">Mécanicien</Label>
            <Input id="mechanicName" name="mechanicName" defaultValue={repair.mechanicName} required />
          </div>

          <div>
            <Label htmlFor="progress">Progression (%)</Label>
            <Input
              id="progress"
              name="progress"
              type="number"
              min="0"
              max="100"
              defaultValue={repair.progress}
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Statut</Label>
            <select
              id="status"
              name="status"
              className="w-full px-3 py-2 border rounded-md"
              defaultValue={repair.status}
              required
            >
              <option value="in_progress">En cours</option>
              <option value="awaiting_parts">En attente de pièces</option>
              <option value="completed">Terminé</option>
            </select>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRepairDialog;
