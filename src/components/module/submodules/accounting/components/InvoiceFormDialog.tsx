
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Invoice, InvoiceItem } from '../types/accounting-types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash } from 'lucide-react';
import { useTaxRatesData } from '../hooks/useTaxRatesData';

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
  onSuccess: () => void;
}

// Type pour le formulaire, adapté de l'interface Invoice
interface FormValues {
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  status: string;
  items: InvoiceItem[];
  currency: string;
  notes: string;
  termsAndConditions: string;
  subtotal: number;
  taxAmount: number;
  total: number;
  taxRate: number;
}

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({
  open,
  onOpenChange,
  invoice,
  onSuccess
}) => {
  const isEditMode = !!invoice;
  const invoicesCollection = useFirestore(COLLECTIONS.ACCOUNTING.INVOICES);
  const { taxRates } = useTaxRatesData();
  
  // Initialiser le formulaire
  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      invoiceNumber: '',
      clientName: '',
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      items: [
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
          taxRate: 20,
        }
      ],
      currency: 'EUR',
      notes: '',
      termsAndConditions: 'Paiement à réception de la facture',
      subtotal: 0,
      taxAmount: 0,
      total: 0,
      taxRate: 20
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });
  
  // Surveiller les valeurs des items pour recalculer les totaux
  const watchedItems = watch("items");
  const watchedTaxRate = watch("taxRate");
  
  // Effet pour calculer les totaux
  useEffect(() => {
    const subtotal = watchedItems.reduce((sum, item) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    
    const taxAmount = subtotal * (watchedTaxRate / 100);
    const total = subtotal + taxAmount;
    
    setValue("subtotal", subtotal);
    setValue("taxAmount", taxAmount);
    setValue("total", total);
  }, [watchedItems, watchedTaxRate, setValue]);
  
  // Effet pour charger les données de la facture
  useEffect(() => {
    if (invoice) {
      reset({
        invoiceNumber: invoice.invoiceNumber || '',
        clientName: invoice.clientName || '',
        issueDate: invoice.issueDate || new Date().toISOString().split('T')[0],
        dueDate: invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: invoice.status || 'draft',
        items: invoice.items?.length ? invoice.items : [{ description: '', quantity: 1, unitPrice: 0, taxRate: 20 }],
        currency: invoice.currency || 'EUR',
        notes: invoice.notes || '',
        termsAndConditions: invoice.termsAndConditions || 'Paiement à réception de la facture',
        subtotal: invoice.subtotal || 0,
        taxAmount: invoice.taxAmount || 0,
        total: invoice.total || 0,
        taxRate: invoice.taxRate || 20
      });
    }
  }, [invoice, reset]);
  
  const onSubmit = async (data: FormValues) => {
    try {
      const invoiceData = {
        ...data,
        updatedAt: new Date()
      };
      
      if (!isEditMode) {
        // Ajout d'une nouvelle facture
        const newInvoiceData = {
          ...invoiceData,
          createdAt: new Date(),
          createdBy: 'current-user',
        };
        
        await invoicesCollection.add(newInvoiceData);
        toast.success('Facture créée avec succès');
      } else if (invoice?.id) {
        // Mise à jour d'une facture existante
        await invoicesCollection.update(invoice.id, invoiceData);
        toast.success('Facture mise à jour avec succès');
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la facture:', error);
      toast.error('Impossible d\'enregistrer la facture');
    }
  };
  
  const addItem = () => {
    append({ description: '', quantity: 1, unitPrice: 0, taxRate: watchedTaxRate });
  };
  
  const handleStatusChange = (value: string) => {
    setValue('status', value);
  };
  
  const handleCurrencyChange = (value: string) => {
    setValue('currency', value);
  };
  
  const handleTaxRateChange = (value: string) => {
    setValue('taxRate', parseFloat(value));
    
    // Mettre à jour le taux de TVA pour tous les articles
    const newItems = watchedItems.map(item => ({
      ...item,
      taxRate: parseFloat(value)
    }));
    
    setValue('items', newItems);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Modifier la facture' : 'Nouvelle facture'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Numéro de facture</Label>
              <Input
                id="invoiceNumber"
                {...register('invoiceNumber', { required: 'Ce champ est requis' })}
              />
              {errors.invoiceNumber && (
                <p className="text-red-500 text-sm">{errors.invoiceNumber.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clientName">Nom du client</Label>
              <Input
                id="clientName"
                {...register('clientName', { required: 'Ce champ est requis' })}
              />
              {errors.clientName && (
                <p className="text-red-500 text-sm">{errors.clientName.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Date d'émission</Label>
              <Input
                id="issueDate"
                type="date"
                {...register('issueDate', { required: 'Ce champ est requis' })}
              />
              {errors.issueDate && (
                <p className="text-red-500 text-sm">{errors.issueDate.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate', { required: 'Ce champ est requis' })}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                defaultValue={watch('status')} 
                onValueChange={handleStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="sent">Envoyée</SelectItem>
                  <SelectItem value="paid">Payée</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                  <SelectItem value="cancelled">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select 
                defaultValue={watch('currency')} 
                onValueChange={handleCurrencyChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="CAD">CAD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="taxRate">Taux de TVA</Label>
              <Select 
                defaultValue={watch('taxRate').toString()} 
                onValueChange={handleTaxRateChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un taux" />
                </SelectTrigger>
                <SelectContent>
                  {taxRates.map(tax => (
                    <SelectItem key={tax.id} value={tax.rate.toString()}>{tax.name} ({tax.rate}%)</SelectItem>
                  ))}
                  {taxRates.length === 0 && (
                    <>
                      <SelectItem value="0">Pas de TVA (0%)</SelectItem>
                      <SelectItem value="5.5">TVA Réduite (5.5%)</SelectItem>
                      <SelectItem value="10">TVA Intermédiaire (10%)</SelectItem>
                      <SelectItem value="20">TVA Standard (20%)</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Articles</h3>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un article
              </Button>
            </div>
            
            <div className="border rounded-md p-3">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 mb-4 items-end">
                  <div className="col-span-5">
                    <Label>Description</Label>
                    <Input
                      {...register(`items.${index}.description` as const, { required: 'Requis' })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Quantité</Label>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      {...register(`items.${index}.quantity` as const, {
                        required: 'Requis',
                        valueAsNumber: true,
                        min: { value: 1, message: 'Min 1' }
                      })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Prix unitaire</Label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      {...register(`items.${index}.unitPrice` as const, {
                        required: 'Requis',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Min 0' }
                      })}
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Sous-total</Label>
                    <Input
                      type="text"
                      value={((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.unitPrice || 0)).toFixed(2)}
                      disabled
                    />
                  </div>
                  <div className="col-span-1 flex justify-end items-end">
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                {...register('notes')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="termsAndConditions">Conditions de paiement</Label>
              <Textarea
                id="termsAndConditions"
                rows={3}
                {...register('termsAndConditions')}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 border-t pt-4">
            <div className="w-1/3 space-y-2">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{watch('subtotal').toFixed(2)} {watch('currency')}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA ({watch('taxRate')}%):</span>
                <span>{watch('taxAmount').toFixed(2)} {watch('currency')}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{watch('total').toFixed(2)} {watch('currency')}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {isEditMode ? 'Mettre à jour' : 'Créer la facture'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceFormDialog;
