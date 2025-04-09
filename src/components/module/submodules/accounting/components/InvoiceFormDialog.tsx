
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Invoice, InvoiceItem } from '../types/accounting-types';
import { useToast } from '@/hooks/use-toast';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { addDocument, setDocument } from '@/hooks/firestore/create-operations';
import { formatCurrency } from '../utils/formatting';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface InvoiceFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
  onSuccess?: () => void;
}

const statusOptions = [
  { value: "draft", label: "Brouillon" },
  { value: "sent", label: "Envoyée" },
  { value: "paid", label: "Payée" },
  { value: "overdue", label: "En retard" },
  { value: "cancelled", label: "Annulée" },
  { value: "pending", label: "En attente" },
];

const currencyOptions = [
  { value: "EUR", label: "EUR" },
  { value: "USD", label: "USD" },
  { value: "GBP", label: "GBP" },
  { value: "CAD", label: "CAD" },
];

const defaultItem: InvoiceItem = {
  description: "",
  quantity: 1,
  unitPrice: 0,
  taxRate: 20,
};

const InvoiceFormDialog: React.FC<InvoiceFormDialogProps> = ({ 
  open, 
  onOpenChange, 
  invoice = null,
  onSuccess 
}) => {
  const { toast } = useToast();
  const isEditing = !!invoice;
  
  const [formData, setFormData] = useState<Partial<Invoice>>({
    invoiceNumber: "",
    clientName: "",
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "draft",
    currency: "EUR",
    items: [{ ...defaultItem }],
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    notes: "",
    termsAndConditions: "Paiement à réception de la facture."
  });

  // Charger les données de la facture existante si en mode édition
  useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        items: invoice.items.length > 0 ? invoice.items : [{ ...defaultItem }]
      });
    }
  }, [invoice]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const updatedItems = [...(formData.items || [])];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: field === 'description' ? value : Number(value)
    };
    
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    // Recalculer les totaux
    calculateTotals(updatedItems);
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...(prev.items || []), { ...defaultItem }]
    }));
  };

  const removeItem = (index: number) => {
    if ((formData.items?.length || 0) <= 1) {
      return; // Garder au moins un élément
    }
    
    const updatedItems = (formData.items || []).filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
    
    // Recalculer les totaux
    calculateTotals(updatedItems);
  };

  const calculateTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const taxAmount = items.reduce((sum, item) => {
      const itemTax = (item.quantity * item.unitPrice) * ((item.taxRate || 0) / 100);
      return sum + itemTax;
    }, 0);
    const total = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const collectionPath = COLLECTIONS.ACCOUNTING.INVOICES;
      
      // Préparer les données
      const invoiceData: Partial<Invoice> = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      
      if (!isEditing) {
        // Ajout d'une nouvelle facture
        invoiceData.createdAt = new Date().toISOString();
        invoiceData.createdBy = "current-user"; // Idéalement, récupérer l'ID de l'utilisateur connecté
        
        const result = await addDocument(collectionPath, invoiceData);
        
        toast({
          title: "Facture créée",
          description: `La facture a été créée avec succès.`
        });
      } else if (invoice?.id) {
        // Mise à jour d'une facture existante
        await setDocument(collectionPath, invoice.id, invoiceData);
        
        toast({
          title: "Facture mise à jour",
          description: `La facture a été mise à jour avec succès.`
        });
      }
      
      // Fermer le dialogue et rafraîchir la liste
      onOpenChange(false);
      if (onSuccess) onSuccess();
      
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement de la facture:", error);
      toast({
        title: "Erreur",
        description: `Une erreur est survenue: ${error.message}`,
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la facture" : "Nouvelle facture"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="invoiceNumber">Numéro de facture</Label>
                <Input 
                  id="invoiceNumber" 
                  name="invoiceNumber" 
                  value={formData.invoiceNumber || ''} 
                  onChange={handleInputChange} 
                  placeholder="FAC-0001"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="clientName">Client</Label>
                <Input 
                  id="clientName" 
                  name="clientName" 
                  value={formData.clientName || ''} 
                  onChange={handleInputChange} 
                  placeholder="Nom du client"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select 
                  value={formData.status || 'draft'} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="issueDate">Date d'émission</Label>
                <Input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={formData.issueDate || ''}
                  onChange={(e) => handleDateChange('issueDate', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <Input
                  type="date"
                  id="dueDate"
                  name="dueDate"
                  value={formData.dueDate || ''}
                  onChange={(e) => handleDateChange('dueDate', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select 
                  value={formData.currency || 'EUR'} 
                  onValueChange={(value) => handleSelectChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencyOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Articles</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="h-4 w-4 mr-2" /> Ajouter un article
                  </Button>
                </div>
                
                {formData.items?.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4 items-end border-b pb-4">
                    <div className="col-span-5">
                      <Label htmlFor={`item-desc-${index}`}>Description</Label>
                      <Input
                        id={`item-desc-${index}`}
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Description de l'article"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`item-qty-${index}`}>Quantité</Label>
                      <Input
                        id={`item-qty-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`item-price-${index}`}>Prix unitaire</Label>
                      <Input
                        id={`item-price-${index}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`item-tax-${index}`}>TVA (%)</Label>
                      <Input
                        id={`item-tax-${index}`}
                        type="number"
                        min="0"
                        max="100"
                        value={item.taxRate || 0}
                        onChange={(e) => handleItemChange(index, 'taxRate', e.target.value)}
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-end">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(index)}
                        disabled={(formData.items?.length || 0) <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <div className="flex flex-col items-end space-y-2 pt-4">
                  <div className="flex justify-between w-64">
                    <span>Sous-total:</span>
                    <span className="font-medium">{formatCurrency(formData.subtotal || 0, formData.currency || 'EUR')}</span>
                  </div>
                  <div className="flex justify-between w-64">
                    <span>TVA:</span>
                    <span className="font-medium">{formatCurrency(formData.taxAmount || 0, formData.currency || 'EUR')}</span>
                  </div>
                  <div className="flex justify-between w-64 text-lg font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(formData.total || 0, formData.currency || 'EUR')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes || ''}
                onChange={handleInputChange}
                placeholder="Notes additionnelles pour le client"
              />
            </div>
            
            <div>
              <Label htmlFor="termsAndConditions">Conditions</Label>
              <Textarea
                id="termsAndConditions"
                name="termsAndConditions"
                rows={3}
                value={formData.termsAndConditions || ''}
                onChange={handleInputChange}
                placeholder="Termes et conditions"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              {isEditing ? "Mettre à jour" : "Créer la facture"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceFormDialog;
