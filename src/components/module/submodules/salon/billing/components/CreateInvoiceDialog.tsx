
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilePlus, Plus, Trash2, Calculator } from "lucide-react";
import { toast } from 'sonner';
import { useSalonBilling } from '../hooks/useSalonBilling';
import { SalonInvoiceItem } from '../../types/salon-types';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({ open, onOpenChange }) => {
  const { createInvoice, generateInvoiceNumber } = useSalonBilling();
  const [loading, setLoading] = useState(false);
  
  const [invoiceData, setInvoiceData] = useState({
    number: '',
    clientName: '',
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [] as SalonInvoiceItem[],
    subtotal: 0,
    taxAmount: 0,
    total: 0,
    notes: '',
    status: 'draft' as const
  });
  
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0,
    taxRate: 20
  });
  
  // Set invoice number and due date when dialog opens
  useEffect(() => {
    if (open) {
      // Generate invoice number
      const number = generateInvoiceNumber();
      
      // Set due date to 30 days from now
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      
      setInvoiceData({
        ...invoiceData,
        number,
        dueDate: dueDate.toISOString().split('T')[0]
      });
    }
  }, [open]);
  
  // Calculate totals
  useEffect(() => {
    if (invoiceData.items.length > 0) {
      const subtotal = invoiceData.items.reduce((total, item) => total + item.total, 0);
      const taxAmount = invoiceData.items.reduce((total, item) => 
        total + (item.total * item.taxRate / 100), 0);
      
      setInvoiceData({
        ...invoiceData,
        subtotal,
        taxAmount,
        total: subtotal + taxAmount
      });
    }
  }, [invoiceData.items]);
  
  // Add item to invoice
  const handleAddItem = () => {
    // Validate item
    if (!newItem.description || newItem.quantity <= 0 || newItem.unitPrice <= 0) {
      toast.error('Veuillez remplir tous les champs de l\'article');
      return;
    }
    
    const itemTotal = newItem.quantity * newItem.unitPrice;
    
    const item: SalonInvoiceItem = {
      id: `item-${Date.now()}`,
      description: newItem.description,
      quantity: newItem.quantity,
      unitPrice: newItem.unitPrice,
      taxRate: newItem.taxRate,
      total: itemTotal
    };
    
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, item]
    });
    
    // Reset new item form
    setNewItem({
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 20
    });
  };
  
  // Remove item from invoice
  const handleRemoveItem = (itemId: string) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter(item => item.id !== itemId)
    });
  };
  
  // Submit invoice
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!invoiceData.clientName) {
        toast.error('Veuillez saisir le nom du client');
        return;
      }
      
      if (invoiceData.items.length === 0) {
        toast.error('Veuillez ajouter au moins un article à la facture');
        return;
      }
      
      setLoading(true);
      
      // Create invoice
      await createInvoice(invoiceData);
      onOpenChange(false);
      
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-number">Numéro de facture</Label>
              <Input 
                id="invoice-number" 
                value={invoiceData.number}
                onChange={(e) => setInvoiceData({ ...invoiceData, number: e.target.value })}
                readOnly
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client-name">Nom du client</Label>
              <Input 
                id="client-name" 
                value={invoiceData.clientName}
                onChange={(e) => setInvoiceData({ ...invoiceData, clientName: e.target.value })}
                placeholder="Nom du client"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client-id">ID Client (optionnel)</Label>
              <Input 
                id="client-id" 
                value={invoiceData.clientId}
                onChange={(e) => setInvoiceData({ ...invoiceData, clientId: e.target.value })}
                placeholder="ID client"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoice-date">Date de facture</Label>
              <Input 
                id="invoice-date" 
                type="date"
                value={invoiceData.date}
                onChange={(e) => setInvoiceData({ ...invoiceData, date: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="due-date">Date d'échéance</Label>
              <Input 
                id="due-date" 
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select 
                value={invoiceData.status}
                onValueChange={(value: any) => setInvoiceData({ ...invoiceData, status: value })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="sent">Envoyée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Articles</h3>
            {invoiceData.items.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {invoiceData.items.length} article(s)
              </div>
            )}
          </div>
          
          {invoiceData.items.length > 0 && (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-2">Description</th>
                    <th className="text-right p-2">Quantité</th>
                    <th className="text-right p-2">Prix unitaire</th>
                    <th className="text-right p-2">TVA %</th>
                    <th className="text-right p-2">Total</th>
                    <th className="p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">{item.description}</td>
                      <td className="text-right p-2">{item.quantity}</td>
                      <td className="text-right p-2">{item.unitPrice.toFixed(2)} €</td>
                      <td className="text-right p-2">{item.taxRate}%</td>
                      <td className="text-right p-2 font-medium">{item.total.toFixed(2)} €</td>
                      <td className="p-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="border rounded-md p-4 space-y-4 bg-muted/30">
            <h4 className="font-medium">Ajouter un article</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
              <div className="md:col-span-2">
                <Input 
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>
              <div>
                <Input 
                  type="number"
                  placeholder="Quantité"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="flex space-x-2">
                <Input 
                  type="number"
                  placeholder="Prix unitaire"
                  step="0.01"
                  min="0"
                  value={newItem.unitPrice}
                  onChange={(e) => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) || 0 })}
                />
                <Select 
                  value={newItem.taxRate.toString()}
                  onValueChange={(value) => setNewItem({ ...newItem, taxRate: parseInt(value) })}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="TVA" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0%</SelectItem>
                    <SelectItem value="5.5">5.5%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="20">20%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" /> Ajouter
              </Button>
            </div>
          </div>
          
          {invoiceData.items.length > 0 && (
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total:</span>
                  <span>{invoiceData.subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA:</span>
                  <span>{invoiceData.taxAmount.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{invoiceData.total.toFixed(2)} €</span>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optionnel)</Label>
            <Textarea 
              id="notes"
              placeholder="Notes additionnelles pour la facture"
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            <FilePlus className="h-4 w-4 mr-2" /> Créer la facture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
