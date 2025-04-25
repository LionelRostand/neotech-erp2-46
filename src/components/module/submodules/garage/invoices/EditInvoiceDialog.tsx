
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
import { Textarea } from "@/components/ui/textarea";
import { Invoice } from '../../types/garage-types';
import { toast } from 'sonner';

interface EditInvoiceDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: Partial<Invoice>) => Promise<void>;
}

const EditInvoiceDialog = ({ invoice, isOpen, onClose, onUpdate }: EditInvoiceDialogProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<Invoice>({
    defaultValues: invoice || {}
  });

  if (!invoice) return null;

  const onSubmit = async (data: Invoice) => {
    try {
      await onUpdate(invoice.id, {
        clientName: data.clientName,
        amount: Number(data.amount),
        tax: Number(data.tax),
        total: Number(data.amount) + Number(data.tax),
        notes: data.notes
      });
      toast.success("Facture mise à jour avec succès");
      onClose();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la facture");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la facture</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Client</label>
              <Input {...register('clientName')} className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Montant HT</label>
              <Input {...register('amount')} type="number" step="0.01" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">TVA</label>
              <Input {...register('tax')} type="number" step="0.01" className="col-span-3" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">Notes</label>
              <Textarea {...register('notes')} className="col-span-3" />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">Sauvegarder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInvoiceDialog;
