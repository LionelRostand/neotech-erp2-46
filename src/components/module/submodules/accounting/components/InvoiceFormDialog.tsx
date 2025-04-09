
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
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { X, Plus, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
  onSuccess: () => void;
}

interface FormValues {
  invoiceNumber: string;
  clientName: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  status: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    taxRate: number;
  }[];
  subtotal: number;
  taxAmount: number;
  total: number;
  notes: string;
  termsAndConditions: string;
}

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({
  open,
  onOpenChange,
  invoice,
  onSuccess
}) => {
  const isEditMode = !!invoice;
  const invoicesCollection = useFirestore(COLLECTIONS.ACCOUNTING.INVOICES);
  
  const defaultItem: InvoiceItem = {
    description: '',
    quantity: 1,
    unitPrice: 0,
    taxRate: 20
  };
  
  const defaultValues: FormValues = {
    invoiceNumber: '',
    clientName: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'EUR',
    status: 'draft',
    items: [defaultItem],
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    notes: '',
    termsAndConditions: 'Paiement sous 30 jours'
  };
  
  const { control, handleSubmit, watch, setValue, register, formState: { errors } } = useForm<FormValues>({
    defaultValues
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items"
  });
  
  // When in edit mode, populate form with invoice data
  useEffect(() => {
    if (invoice) {
      setValue('invoiceNumber', invoice.invoiceNumber || invoice.number || '');
      setValue('clientName', invoice.clientName || '');
      setValue('issueDate', invoice.issueDate || defaultValues.issueDate);
      setValue('dueDate', invoice.dueDate || defaultValues.dueDate);
      setValue('currency', invoice.currency || 'EUR');
      setValue('status', invoice.status || 'draft');
      setValue('notes', invoice.notes || '');
      setValue('termsAndConditions', invoice.termsAndConditions || defaultValues.termsAndConditions);
      
      // Handle items
      if (invoice.items && invoice.items.length > 0) {
        // Reset items field array
        while (fields.length) {
          remove(0);
        }
        
        // Add each item from the invoice
        invoice.items.forEach(item => {
          append({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            taxRate: item.taxRate || 20
          });
        });
      }
      
      // Set calculated fields
      setValue('subtotal', invoice.subtotal || 0);
      setValue('taxAmount', invoice.taxAmount || 0);
      setValue('total', invoice.total || 0);
    }
  }, [invoice, setValue, append, remove, fields.length, defaultValues.issueDate, defaultValues.dueDate, defaultValues.termsAndConditions]);
  
  // Watch items to recalculate totals
  const watchItems = watch('items');
  
  useEffect(() => {
    if (watchItems) {
      let subtotal = 0;
      let taxAmount = 0;
      
      watchItems.forEach(item => {
        const lineTotal = item.quantity * item.unitPrice;
        subtotal += lineTotal;
        
        if (item.taxRate) {
          taxAmount += lineTotal * (item.taxRate / 100);
        }
      });
      
      const total = subtotal + taxAmount;
      
      setValue('subtotal', subtotal);
      setValue('taxAmount', taxAmount);
      setValue('total', total);
    }
  }, [watchItems, setValue]);
  
  const handleAddItem = () => {
    append(defaultItem);
  };
  
  const onSubmit = async (data: FormValues) => {
    try {
      const invoiceData = {
        ...data,
        updatedAt: new Date(),
      };
      
      if (!isEditMode) {
        // Add new properties for new invoices
        const newInvoiceData = {
          ...invoiceData,
          createdAt: new Date(),
          createdBy: 'current-user',
        };
        
        await invoicesCollection.add(newInvoiceData);
        toast.success('Facture créée avec succès');
      } else if (invoice?.id) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Modifier la facture' : 'Nouvelle facture'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Numéro de facture</Label>
              <Input
                id="invoiceNumber"
                {...register('invoiceNumber', { required: 'Le numéro de facture est requis' })}
              />
              {errors.invoiceNumber && (
                <p className="text-sm text-destructive">{errors.invoiceNumber.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <SelectTrigger id="status">
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
                )}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientName">Client</Label>
            <Input
              id="clientName"
              {...register('clientName', { required: 'Le nom du client est requis' })}
            />
            {errors.clientName && (
              <p className="text-sm text-destructive">{errors.clientName.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Date d'émission</Label>
              <Input
                id="issueDate"
                type="date"
                {...register('issueDate')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Sélectionner une devise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          
          {/* Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Articles</Label>
              <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                <Plus className="mr-1 h-4 w-4" /> Ajouter un article
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <table className="w-full border-collapse">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-2">Description</th>
                      <th className="text-right p-2 w-20">Quantité</th>
                      <th className="text-right p-2 w-32">Prix unitaire</th>
                      <th className="text-right p-2 w-20">TVA (%)</th>
                      <th className="text-right p-2 w-32">Total</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((item, index) => {
                      const itemTotal = watch(`items.${index}.quantity`) * watch(`items.${index}.unitPrice`);
                      const taxAmount = itemTotal * (watch(`items.${index}.taxRate`) / 100);
                      
                      return (
                        <tr key={item.id} className="border-b border-muted">
                          <td className="p-2">
                            <Input
                              {...register(`items.${index}.description` as const, {
                                required: 'Description requise'
                              })}
                              placeholder="Description de l'article"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              {...register(`items.${index}.quantity` as const, {
                                valueAsNumber: true,
                                min: { value: 1, message: 'Min. 1' }
                              })}
                              type="number"
                              min="1"
                              step="1"
                              className="text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              {...register(`items.${index}.unitPrice` as const, {
                                valueAsNumber: true,
                                min: { value: 0, message: 'Min. 0' }
                              })}
                              type="number"
                              min="0"
                              step="0.01"
                              className="text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              {...register(`items.${index}.taxRate` as const, {
                                valueAsNumber: true,
                                min: { value: 0, message: 'Min. 0' },
                                max: { value: 100, message: 'Max. 100' }
                              })}
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              className="text-right"
                            />
                          </td>
                          <td className="p-2 text-right font-medium">
                            {new Intl.NumberFormat('fr-FR', {
                              style: 'currency',
                              currency: watch('currency')
                            }).format(itemTotal + taxAmount)}
                          </td>
                          <td className="p-2">
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => remove(index)}
                              disabled={fields.length === 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
            
            {/* Totals */}
            <div className="flex justify-end">
              <div className="w-80 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sous-total:</span>
                  <span>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: watch('currency')
                    }).format(watch('subtotal'))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>TVA:</span>
                  <span>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: watch('currency')
                    }).format(watch('taxAmount'))}
                  </span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: watch('currency')
                    }).format(watch('total'))}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                rows={3}
                placeholder="Notes complémentaires"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="termsAndConditions">Conditions de paiement</Label>
              <Textarea
                id="termsAndConditions"
                {...register('termsAndConditions')}
                rows={3}
                placeholder="Conditions de paiement"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {isEditMode ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceFormDialog;
