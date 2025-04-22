
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FreightInvoice } from '@/hooks/modules/useFreightInvoices';
import { toast } from 'sonner';

interface EditInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice: FreightInvoice;
  onUpdate: (id: string, data: Partial<FreightInvoice>) => Promise<boolean>;
}

export const EditInvoiceDialog = ({
  open,
  onOpenChange,
  invoice,
  onUpdate
}: EditInvoiceDialogProps) => {
  const form = useForm({
    defaultValues: {
      invoiceNumber: invoice.invoiceNumber || '',
      clientName: invoice.clientName,
      amount: invoice.amount.toString(),
      containerNumber: invoice.containerNumber || '',
      shipmentReference: invoice.shipmentReference || '',
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const success = await onUpdate(invoice.id, {
        ...data,
        amount: parseFloat(data.amount)
      });
      
      if (success) {
        toast.success('Facture mise à jour avec succès');
        onOpenChange(false);
      } else {
        toast.error('Erreur lors de la mise à jour de la facture');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de la facture');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier la facture</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° Facture</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Montant</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" step="0.01" />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="containerNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>N° Conteneur</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="shipmentReference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Réf. Expédition</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
