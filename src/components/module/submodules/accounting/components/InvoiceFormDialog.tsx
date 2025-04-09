
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Invoice, InvoiceItem } from '../types/accounting-types';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { formatCurrency } from '../utils/formatting';

// Schéma de validation
const invoiceItemSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(1, "La description est requise"),
  quantity: z.coerce.number().min(1, "La quantité doit être au moins 1"),
  unitPrice: z.coerce.number().min(0, "Le prix unitaire ne peut pas être négatif"),
  taxRate: z.coerce.number().min(0, "Le taux de taxe ne peut pas être négatif").max(100, "Le taux de taxe ne peut pas dépasser 100%"),
  taxType: z.enum(["standard", "reduced", "exempt"]),
  total: z.number().optional(),
});

const invoiceSchema = z.object({
  number: z.string().min(1, "Le numéro de facture est requis"),
  clientName: z.string().min(1, "Le nom du client est requis"),
  clientId: z.string().optional(),
  issueDate: z.string().min(1, "La date d'émission est requise"),
  dueDate: z.string().min(1, "La date d'échéance est requise"),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
  items: z.array(invoiceItemSchema).min(1, "Ajoutez au moins un article"),
  notes: z.string().optional(),
  termsAndConditions: z.string().optional(),
  currency: z.enum(["EUR", "USD", "GBP", "CAD", "CHF", "JPY"]).default("EUR"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice;
  onSuccess?: () => void;
}

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({ 
  open, 
  onOpenChange, 
  invoice, 
  onSuccess 
}) => {
  const isEditing = !!invoice;
  const invoicesCollection = useFirestore(COLLECTIONS.ACCOUNTING.INVOICES);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialiser le formulaire avec les valeurs par défaut ou existantes
  const { control, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      number: invoice?.number || `FACT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      clientName: invoice?.clientName || '',
      clientId: invoice?.clientId || '',
      issueDate: invoice?.issueDate || new Date().toISOString().split('T')[0],
      dueDate: invoice?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: invoice?.status || 'draft',
      items: invoice?.items || [{ 
        id: uuidv4(),
        description: '', 
        quantity: 1, 
        unitPrice: 0, 
        taxRate: 20, 
        taxType: 'standard',
        total: 0 
      }],
      notes: invoice?.notes || '',
      termsAndConditions: invoice?.termsAndConditions || 'Paiement dû dans les 30 jours suivant la réception.',
      currency: invoice?.currency || 'EUR',
    }
  });

  // Configuration du tableau d'articles
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Observer les changements d'articles pour recalculer les totaux
  const items = watch('items');
  
  useEffect(() => {
    // Recalculer le total pour chaque article
    items.forEach((item, index) => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice || 0;
      const taxRate = item.taxRate || 0;
      const total = quantity * unitPrice * (1 + taxRate / 100);
      setValue(`items.${index}.total`, total);
    });
  }, [items, setValue]);

  // Réinitialiser le formulaire quand la facture change
  useEffect(() => {
    if (open) {
      reset({
        number: invoice?.number || `FACT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        clientName: invoice?.clientName || '',
        clientId: invoice?.clientId || '',
        issueDate: invoice?.issueDate || new Date().toISOString().split('T')[0],
        dueDate: invoice?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: invoice?.status || 'draft',
        items: invoice?.items?.length ? invoice.items : [{ 
          id: uuidv4(),
          description: '', 
          quantity: 1, 
          unitPrice: 0, 
          taxRate: 20, 
          taxType: 'standard',
          total: 0 
        }],
        notes: invoice?.notes || '',
        termsAndConditions: invoice?.termsAndConditions || 'Paiement dû dans les 30 jours suivant la réception.',
        currency: invoice?.currency || 'EUR',
      });
    }
  }, [invoice, open, reset]);

  const onSubmit = async (data: InvoiceFormData) => {
    setIsSubmitting(true);
    
    try {
      // Calculer les totaux
      const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
      const taxAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
      const total = subtotal + taxAmount;

      const invoiceData = {
        ...data,
        subtotal,
        taxAmount,
        total,
        createdAt: invoice?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: invoice?.createdBy || 'current_user', // Remplacer par l'ID de l'utilisateur actuel
      };

      if (isEditing && invoice) {
        // Mise à jour
        await invoicesCollection.update(invoice.id, invoiceData);
        toast.success('Facture mise à jour avec succès');
      } else {
        // Création
        await invoicesCollection.add(invoiceData);
        toast.success('Facture créée avec succès');
      }

      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
      toast.error('Erreur lors de l\'enregistrement de la facture');
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
      taxType: 'standard',
      total: 0 
    });
  };

  // Calculer le total de la facture
  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const quantity = item.quantity || 0;
      const unitPrice = item.unitPrice || 0;
      const taxRate = item.taxRate || 0;
      return sum + (quantity * unitPrice * (1 + taxRate / 100));
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier la facture' : 'Nouvelle facture'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Numéro de facture</Label>
              <Controller
                name="number"
                control={control}
                render={({ field }) => (
                  <Input id="number" {...field} />
                )}
              />
              {errors.number && <p className="text-red-500 text-sm">{errors.number.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Controller
                name="status"
                control={control}
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
                      <SelectItem value="sent">Envoyée</SelectItem>
                      <SelectItem value="paid">Payée</SelectItem>
                      <SelectItem value="overdue">En retard</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientName">Nom du client</Label>
            <Controller
              name="clientName"
              control={control}
              render={({ field }) => (
                <Input id="clientName" {...field} />
              )}
            />
            {errors.clientName && <p className="text-red-500 text-sm">{errors.clientName.message}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Date d'émission</Label>
              <Controller
                name="issueDate"
                control={control}
                render={({ field }) => (
                  <Input id="issueDate" type="date" {...field} />
                )}
              />
              {errors.issueDate && <p className="text-red-500 text-sm">{errors.issueDate.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Input id="dueDate" type="date" {...field} />
                )}
              />
              {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="currency">Devise</Label>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                    <SelectItem value="CHF">CHF (Fr)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.currency && <p className="text-red-500 text-sm">{errors.currency.message}</p>}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label>Articles</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddItem}
              >
                <Plus className="h-4 w-4 mr-1" /> Ajouter un article
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-12 gap-2 mb-2 items-end">
                <div className="col-span-4">
                  <Controller
                    name={`items.${index}.description`}
                    control={control}
                    render={({ field }) => (
                      <Input placeholder="Description" {...field} />
                    )}
                  />
                  {errors.items?.[index]?.description && (
                    <p className="text-red-500 text-xs">{errors.items[index]?.description?.message}</p>
                  )}
                </div>
                
                <div className="col-span-1">
                  <Controller
                    name={`items.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="Qté" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value) || 0);
                        }}
                      />
                    )}
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="text-red-500 text-xs">{errors.items[index]?.quantity?.message}</p>
                  )}
                </div>
                
                <div className="col-span-2">
                  <Controller
                    name={`items.${index}.unitPrice`}
                    control={control}
                    render={({ field }) => (
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="Prix unitaire" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value) || 0);
                        }}
                      />
                    )}
                  />
                  {errors.items?.[index]?.unitPrice && (
                    <p className="text-red-500 text-xs">{errors.items[index]?.unitPrice?.message}</p>
                  )}
                </div>
                
                <div className="col-span-1">
                  <Controller
                    name={`items.${index}.taxRate`}
                    control={control}
                    render={({ field }) => (
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="% TVA" 
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value) || 0);
                        }}
                      />
                    )}
                  />
                  {errors.items?.[index]?.taxRate && (
                    <p className="text-red-500 text-xs">{errors.items[index]?.taxRate?.message}</p>
                  )}
                </div>
                
                <div className="col-span-2">
                  <Controller
                    name={`items.${index}.taxType`}
                    control={control}
                    render={({ field }) => (
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Type de taxe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="reduced">Réduit</SelectItem>
                          <SelectItem value="exempt">Exonéré</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                
                <div className="col-span-1">
                  <div className="text-right font-medium">
                    {formatCurrency((items[index]?.quantity || 0) * (items[index]?.unitPrice || 0) * (1 + (items[index]?.taxRate || 0) / 100), watch('currency'))}
                  </div>
                </div>
                
                <div className="col-span-1">
                  {fields.length > 1 && (
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {errors.items && !Array.isArray(errors.items) && (
              <p className="text-red-500 text-sm">{errors.items.message}</p>
            )}
            
            <div className="flex justify-end mt-4">
              <div className="space-y-2 w-1/3">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-bold">{formatCurrency(calculateTotal(), watch('currency'))}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <Textarea 
                  id="notes" 
                  placeholder="Notes additionnelles pour la facture" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              )}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="termsAndConditions">Conditions de paiement</Label>
            <Controller
              name="termsAndConditions"
              control={control}
              render={({ field }) => (
                <Textarea 
                  id="termsAndConditions" 
                  placeholder="Termes et conditions de paiement" 
                  className="min-h-[80px]" 
                  {...field} 
                />
              )}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceFormDialog;
