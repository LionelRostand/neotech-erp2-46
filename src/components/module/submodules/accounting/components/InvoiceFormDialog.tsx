
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Invoice, InvoiceItem } from '../types/accounting-types';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrashIcon, Plus } from "lucide-react";
import { formatCurrency } from '../utils/formatting';

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
  onSave: (invoice: Invoice) => void;
}

interface FormValues {
  invoiceNumber?: string;
  clientName?: string;
  clientId?: string;
  issueDate?: string;
  dueDate?: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
  }[];
  currency?: string;
  notes?: string;
  termsAndConditions?: string;
  status?: string;
  subtotal?: number;
  taxAmount?: number;
  total?: number;
}

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({
  open,
  onOpenChange,
  invoice,
  onSave
}) => {
  const { control, register, handleSubmit, setValue, watch, formState: { errors }, reset } = useForm<FormValues>({
    defaultValues: {
      invoiceNumber: '',
      clientName: '',
      clientId: '',
      issueDate: new Date().toISOString().substring(0, 10),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().substring(0, 10),
      items: [{
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 20
      }],
      currency: 'EUR',
      notes: '',
      termsAndConditions: '',
      status: 'draft',
      subtotal: 0,
      taxAmount: 0,
      total: 0
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });

  // Initialisation du formulaire avec les données existantes
  useEffect(() => {
    if (invoice) {
      reset({
        invoiceNumber: invoice.invoiceNumber || '',
        clientName: invoice.clientName || '',
        clientId: invoice.clientId || '',
        issueDate: invoice.issueDate || new Date().toISOString().substring(0, 10),
        dueDate: invoice.dueDate || new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().substring(0, 10),
        items: invoice.items && invoice.items.length > 0 ? invoice.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          taxRate: item.taxRate || 20
        })) : [{
          description: '',
          quantity: 1,
          unitPrice: 0,
          taxRate: 20
        }],
        currency: invoice.currency || 'EUR',
        notes: invoice.notes || '',
        termsAndConditions: invoice.termsAndConditions || '',
        status: invoice.status || 'draft',
        subtotal: invoice.subtotal || 0,
        taxAmount: invoice.taxAmount || 0,
        total: invoice.total || 0
      });
    }
  }, [invoice, reset]);

  // Calculer les montants à chaque changement
  const items = watch('items');
  
  useEffect(() => {
    if (items) {
      const subtotal = items.reduce((acc, item) => {
        return acc + (item.quantity * item.unitPrice);
      }, 0);
      
      const taxAmount = items.reduce((acc, item) => {
        return acc + (item.quantity * item.unitPrice * ((item.taxRate || 0) / 100));
      }, 0);
      
      const total = subtotal + taxAmount;
      
      setValue('subtotal', subtotal);
      setValue('taxAmount', taxAmount);
      setValue('total', total);
    }
  }, [items, setValue]);

  const addItem = () => {
    append({ description: '', quantity: 1, unitPrice: 0, taxRate: 20 });
  };

  const onSubmit = (data: FormValues) => {
    const newInvoice: Invoice = {
      id: invoice?.id || '',
      invoiceNumber: data.invoiceNumber,
      number: data.invoiceNumber,
      clientName: data.clientName,
      clientId: data.clientId,
      issueDate: data.issueDate,
      dueDate: data.dueDate,
      items: data.items,
      currency: data.currency,
      notes: data.notes,
      termsAndConditions: data.termsAndConditions,
      status: data.status || 'draft',
      subtotal: data.subtotal,
      taxRate: data.items[0]?.taxRate, // Utiliser le taux de taxe du premier élément comme taux global (simplifié)
      taxAmount: data.taxAmount,
      total: data.total
    };
    
    onSave(newInvoice);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {invoice ? 'Modifier la facture' : 'Nouvelle facture'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Numéro de facture</Label>
              <Input id="invoiceNumber" {...register('invoiceNumber')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Client</Label>
              <Input id="clientName" {...register('clientName')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issueDate">Date d'émission</Label>
              <Input id="issueDate" type="date" {...register('issueDate')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input id="dueDate" type="date" {...register('dueDate')} />
            </div>
          </div>
          
          {/* Articles de la facture */}
          <div className="space-y-4">
            <Label>Articles</Label>
            
            <div className="border rounded-md p-3">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 mb-2">
                  <div className="col-span-5">
                    <Input 
                      placeholder="Description" 
                      {...register(`items.${index}.description`)} 
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      placeholder="Quantité" 
                      min="1"
                      {...register(`items.${index}.quantity`, { valueAsNumber: true })} 
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      placeholder="Prix unitaire" 
                      min="0"
                      step="0.01"
                      {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} 
                    />
                  </div>
                  <div className="col-span-2">
                    <Input 
                      type="number" 
                      placeholder="TVA %" 
                      min="0"
                      {...register(`items.${index}.taxRate`, { valueAsNumber: true })} 
                    />
                  </div>
                  <div className="col-span-1 flex items-center justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-2" /> Ajouter un article
              </Button>
            </div>
          </div>
          
          {/* Informations supplémentaires */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="USD">Dollar ($)</SelectItem>
                      <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="paid">Payée</SelectItem>
                      <SelectItem value="overdue">En retard</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...register('notes')} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="termsAndConditions">Conditions</Label>
              <Textarea id="termsAndConditions" {...register('termsAndConditions')} />
            </div>
          </div>
          
          {/* Totaux */}
          <div className="border-t pt-4">
            <div className="flex justify-between my-2">
              <span className="font-medium">Sous-total:</span>
              <span>{formatCurrency(watch('subtotal') || 0, watch('currency') || 'EUR')}</span>
            </div>
            <div className="flex justify-between my-2">
              <span className="font-medium">TVA:</span>
              <span>{formatCurrency(watch('taxAmount') || 0, watch('currency') || 'EUR')}</span>
            </div>
            <div className="flex justify-between my-2 text-lg font-bold">
              <span>Total:</span>
              <span>{formatCurrency(watch('total') || 0, watch('currency') || 'EUR')}</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {invoice ? 'Mettre à jour' : 'Créer la facture'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceFormDialog;
