
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, useFieldArray } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Invoice, InvoiceItem } from '../types/accounting-types';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { formatCurrency } from '../utils/formatting';

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
  onSuccess: () => void;
}

type FormValues = Omit<Invoice, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'createdBy'> & {
  items: InvoiceItem[];
};

const currencyOptions = [
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'CHF', label: 'Swiss Franc (CHF)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
] as const;

type CurrencyType = typeof currencyOptions[number]['value'];

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({ open, onOpenChange, invoice, onSuccess }) => {
  const invoicesCollection = useFirestore(COLLECTIONS.ACCOUNTING.INVOICES);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultValues: FormValues = {
    invoiceNumber: '',
    clientId: '',
    clientName: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 20,
      amount: 0,
    }],
    subtotal: 0,
    taxRate: 20,
    taxAmount: 0,
    total: 0,
    status: 'draft',
    notes: '',
    termsAndConditions: 'Paiement à réception de la facture',
    currency: 'EUR',
  };
  
  const form = useForm<FormValues>({
    defaultValues
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items"
  });
  
  useEffect(() => {
    if (invoice) {
      form.reset({
        invoiceNumber: invoice.invoiceNumber,
        clientId: invoice.clientId,
        clientName: invoice.clientName,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        items: invoice.items,
        subtotal: invoice.subtotal,
        taxRate: invoice.taxRate,
        taxAmount: invoice.taxAmount,
        total: invoice.total,
        status: invoice.status,
        notes: invoice.notes,
        termsAndConditions: invoice.termsAndConditions || 'Paiement à réception de la facture',
        currency: invoice.currency,
      });
    } else {
      form.reset(defaultValues);
    }
  }, [invoice, form]);
  
  const calculateSubtotal = (items: InvoiceItem[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };
  
  const calculateTaxAmount = (subtotal: number, taxRate: number) => {
    return subtotal * (taxRate / 100);
  };
  
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      // Recalculate all values to ensure consistency
      const subtotal = calculateSubtotal(data.items);
      const taxAmount = calculateTaxAmount(subtotal, data.taxRate);
      const total = subtotal + taxAmount;
      
      const formattedData = {
        ...data,
        subtotal,
        taxAmount,
        total,
        items: data.items.map(item => ({
          ...item,
          amount: item.quantity * item.unitPrice
        }))
      };
      
      if (invoice) {
        // Update existing invoice
        await invoicesCollection.update(invoice.id, {
          ...formattedData,
          updatedAt: new Date()
        });
        toast.success('Facture mise à jour avec succès');
      } else {
        // Create new invoice
        const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        await invoicesCollection.add({
          ...formattedData,
          invoiceNumber,
          number: invoiceNumber, // For compatibility
          createdAt: new Date(),
          updatedAt: new Date(),
          createdBy: 'current-user' // In a real app, get from auth context
        });
        toast.success('Facture créée avec succès');
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la facture:', error);
      toast.error('Impossible de sauvegarder la facture');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleAddItem = () => {
    append({
      id: uuidv4(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 20,
      amount: 0
    });
  };
  
  const handleRemoveItem = (index: number) => {
    remove(index);
  };
  
  const watchItems = form.watch('items');
  const watchTaxRate = form.watch('taxRate');
  
  useEffect(() => {
    const subtotal = calculateSubtotal(watchItems);
    const taxAmount = calculateTaxAmount(subtotal, watchTaxRate);
    const total = subtotal + taxAmount;
    
    form.setValue('subtotal', subtotal);
    form.setValue('taxAmount', taxAmount);
    form.setValue('total', total);
  }, [watchItems, watchTaxRate, form]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{invoice ? 'Modifier la facture' : 'Nouvelle facture'}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="clientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom du client" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Brouillon</SelectItem>
                        <SelectItem value="sent">Envoyée</SelectItem>
                        <SelectItem value="paid">Payée</SelectItem>
                        <SelectItem value="overdue">En retard</SelectItem>
                        <SelectItem value="cancelled">Annulée</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'émission</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date d'échéance</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devise</FormLabel>
                    <Select
                      onValueChange={field.onChange as (value: string) => void}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner une devise" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {currencyOptions.map((currency) => (
                          <SelectItem key={currency.value} value={currency.value}>
                            {currency.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taxRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Taux de TVA (%)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Articles</h3>
                <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                  Ajouter un article
                </Button>
              </div>
              
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-5">
                    <FormField
                      control={form.control}
                      name={`items.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index > 0 ? "sr-only" : undefined}>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="Description" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index > 0 ? "sr-only" : undefined}>Qté</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              step="1" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.unitPrice`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index > 0 ? "sr-only" : undefined}>Prix</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.01" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.taxRate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={index > 0 ? "sr-only" : undefined}>TVA %</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.1" 
                              {...field} 
                              onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="col-span-1 pt-6">
                    {index > 0 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive" 
                        onClick={() => handleRemoveItem(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Notes pour le client" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div>
                <FormField
                  control={form.control}
                  name="termsAndConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conditions de paiement</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Conditions de paiement" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <div className="space-y-2 text-right">
                <div className="text-sm">
                  <span className="font-medium">Sous-total:</span> {formatCurrency(form.watch('subtotal'), form.watch('currency'))}
                </div>
                <div className="text-sm">
                  <span className="font-medium">TVA:</span> {formatCurrency(form.watch('taxAmount'), form.watch('currency'))}
                </div>
                <div className="text-lg font-bold">
                  <span>Total:</span> {formatCurrency(form.watch('total'), form.watch('currency'))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Enregistrement...' : invoice ? 'Mettre à jour' : 'Créer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceFormDialog;
