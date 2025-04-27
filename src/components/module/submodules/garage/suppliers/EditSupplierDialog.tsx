
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GarageSupplier } from '@/hooks/garage/useGarageSuppliers';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface EditSupplierDialogProps {
  supplier: GarageSupplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: GarageSupplier) => Promise<void>;
}

const EditSupplierDialog = ({ supplier, open, onOpenChange, onSave }: EditSupplierDialogProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<GarageSupplier>({
    defaultValues: supplier || undefined
  });

  const onSubmit = async (data: GarageSupplier) => {
    try {
      await onSave({ ...supplier, ...data });
      onOpenChange(false);
      toast.success('Fournisseur mis à jour avec succès');
    } catch (error) {
      console.error('Error updating supplier:', error);
      toast.error('Erreur lors de la mise à jour du fournisseur');
    }
  };

  if (!supplier) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier le fournisseur</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom de l'entreprise</label>
              <Input {...register('name', { required: true })} />
              {errors.name && <span className="text-red-500 text-sm">Ce champ est requis</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Input {...register('category')} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom du contact</label>
              <Input {...register('contactName', { required: true })} />
              {errors.contactName && <span className="text-red-500 text-sm">Ce champ est requis</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input {...register('email', { required: true })} />
              {errors.email && <span className="text-red-500 text-sm">Ce champ est requis</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Téléphone</label>
              <Input {...register('phone', { required: true })} />
              {errors.phone && <span className="text-red-500 text-sm">Ce champ est requis</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Adresse</label>
              <Input {...register('address')} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Input {...register('notes')} />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Sauvegarder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSupplierDialog;
