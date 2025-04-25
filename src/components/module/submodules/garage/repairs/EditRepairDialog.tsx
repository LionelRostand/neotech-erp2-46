
import React from 'react';
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Repair } from '../../types/garage-types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface EditRepairDialogProps {
  repair: Repair | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const EditRepairDialog: React.FC<EditRepairDialogProps> = ({
  repair,
  open,
  onOpenChange,
  onUpdate
}) => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      description: repair?.description || '',
      status: repair?.status || 'pending',
      startDate: repair?.startDate || '',
      endDate: repair?.endDate || '',
      cost: repair?.cost || 0,
      notes: repair?.notes || ''
    }
  });

  const onSubmit = async (data: any) => {
    if (!repair?.id) return;

    try {
      const repairRef = doc(db, COLLECTIONS.GARAGE.REPAIRS, repair.id);
      await updateDoc(repairRef, {
        ...data,
        lastUpdated: new Date().toISOString()
      });

      toast.success('Réparation mise à jour avec succès');
      onUpdate();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating repair:', error);
      toast.error('Erreur lors de la mise à jour de la réparation');
    }
  };

  if (!repair) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Modifier la réparation</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                className="col-span-3"
                {...register('description')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status">Statut</Label>
              <Select {...register('status')}>
                <SelectTrigger className="col-span-3">
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
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cost">Coût</Label>
              <Input
                id="cost"
                type="number"
                className="col-span-3"
                {...register('cost')}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                className="col-span-3"
                {...register('notes')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRepairDialog;
