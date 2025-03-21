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
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus, Trash, Save } from "lucide-react";
import { useSalonBilling } from '../hooks/useSalonBilling';
import { InvoiceItem, InvoiceStatus } from '../../types/salon-types';
import { toast } from 'sonner';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for services and products
const mockServices = [
  { id: 'service1', name: 'Coupe femme', price: 45 },
  { id: 'service2', name: 'Coloration', price: 65 },
  { id: 'service3', name: 'Balayage', price: 90 },
  { id: 'service4', name: 'Brushing', price: 35 },
  { id: 'service5', name: 'Coupe homme', price: 25 }
];

const mockProducts = [
  { id: 'product1', name: 'Shampooing professionnel', price: 18 },
  { id: 'product2', name: 'Après-shampooing', price: 16 },
  { id: 'product3', name: 'Masque capillaire', price: 22 },
  { id: 'product4', name: 'Spray coiffant', price: 15 },
  { id: 'product5', name: 'Gel fixant', price: 12 }
];

const mockClients = [
  { id: 'client1', name: 'Marie Dubois' },
  { id: 'client2', name: 'Thomas Bernard' },
  { id: 'client3', name: 'Lucie Martin' },
  { id: 'client4', name: 'Pierre Durand' },
  { id: 'client5', name: 'Sophie Petit' }
];

const mockStylists = [
  { id: 'stylist1', name: 'Jean Martin' },
  { id: 'stylist2', name: 'Sophie Petit' },
  { id: 'stylist3', name: 'Lucas Robert' }
];

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({ open, onOpenChange }) => {
  const { createInvoice, generateInvoiceNumber } = useSalonBilling();
  
  const [formData, setFormData] = useState({
    number: '',
    clientId: '',
    clientName: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), // 15 days later
    items: [] as InvoiceItem[],
    subtotal: 0,
    taxRate: 20, // Default tax rate (20%)
    taxAmount: 0,
    discount: 0,
    total: 0,
    notes: ''
  });
  
  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        ...formData,
        number: generateInvoiceNumber(),
        items: [],
        subtotal: 0,
        taxAmount: 0,
        total: 0
      });
    }
  }, [open, generateInvoiceNumber]);
  
  // Recalculate totals when items, tax rate, or discount changes
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (subtotal - formData.discount) * (formData.taxRate / 100);
    const total = subtotal - formData.discount + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      subtotal,
      taxAmount,
      total
    }));
  }, [formData.items, formData.taxRate, formData.discount]);
  
  // Handle client selection
  const handleClientChange = (clientId: string) => {
    const client = mockClients.find(c => c.id === clientId);
    setFormData({
      ...formData,
      clientId,
      clientName: client ? client.name : ''
    });
  };
  
  // Add item to invoice
  const addItem = (type: 'service' | 'product') => {
    const newItem: InvoiceItem = {
      id: `item${formData.items.length + 1}`,
      type,
      name: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    };
    
    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    });
  };
  
  // Update item
  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items];
    const item = { ...updatedItems[index], [field]: value };
    
    // If item type, name, or price changed, update related fields
    if (field === 'type' || field === 'name') {
      if (item.type === 'service') {
        const selectedService = mockServices.find(s => s.name === item.name);
        if (selectedService) {
          item.unitPrice = selectedService.price;
          item.serviceId = selectedService.id;
        }
      } else if (item.type === 'product') {
        const selectedProduct = mockProducts.find(p => p.name === item.name);
        if (selectedProduct) {
          item.unitPrice = selectedProduct.price;
          item.productId = selectedProduct.id;
        }
      }
    }
    
    // If stylist changed
    if (field === 'stylistId') {
      const stylist = mockStylists.find(s => s.id === value);
      item.stylistName = stylist ? stylist.name : '';
    }
    
    // Recalculate total
    item.total = item.quantity * item.unitPrice;
    
    updatedItems[index] = item;
    setFormData({
      ...formData,
      items: updatedItems
    });
  };
  
  // Remove item
  const removeItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: updatedItems
    });
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Basic validation
      if (!formData.clientId) {
        toast.error('Veuillez sélectionner un client');
        return;
      }
      
      if (formData.items.length === 0) {
        toast.error('Veuillez ajouter au moins un service ou produit');
        return;
      }
      
      // Create invoice
      await createInvoice({
        ...formData,
        status: 'pending' as InvoiceStatus
      });
      
      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Erreur lors de la création de la facture');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Numéro de facture</Label>
            <Input
              id="invoiceNumber"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              disabled
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select onValueChange={handleClientChange}>
              <SelectTrigger id="client">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Clients</SelectLabel>
                  {mockClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date de facturation</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Date d'échéance</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Services et produits</h3>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => addItem('service')}
              >
                <Plus className="h-4 w-4 mr-1" /> Service
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addItem('product')}
              >
                <Plus className="h-4 w-4 mr-1" /> Produit
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Désignation</TableHead>
                <TableHead>Coiffeur</TableHead>
                <TableHead className="text-right">Prix unitaire</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    Aucun service ou produit ajouté
                  </TableCell>
                </TableRow>
              ) : (
                formData.items.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Select
                        value={item.type}
                        onValueChange={(value) => updateItem(index, 'type', value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="service">Service</SelectItem>
                          <SelectItem value="product">Produit</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.name}
                        onValueChange={(value) => updateItem(index, 'name', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          {item.type === 'service' ? (
                            mockServices.map((service) => (
                              <SelectItem key={service.id} value={service.name}>
                                {service.name}
                              </SelectItem>
                            ))
                          ) : (
                            mockProducts.map((product) => (
                              <SelectItem key={product.id} value={product.name}>
                                {product.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {item.type === 'service' ? (
                        <Select
                          value={item.stylistId}
                          onValueChange={(value) => updateItem(index, 'stylistId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Coiffeur" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockStylists.map((stylist) => (
                              <SelectItem key={stylist.id} value={stylist.id}>
                                {stylist.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.unitPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        min={1}
                        className="w-16 text-right"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                      />
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {item.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          <div className="space-y-2 mt-4">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Notes ou informations supplémentaires pour cette facture"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>
          
          <div className="flex flex-col items-end space-y-2 pt-4 border-t">
            <div className="flex justify-between w-full md:w-1/2">
              <span>Sous-total:</span>
              <span className="font-medium">
                {formData.subtotal.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            
            <div className="flex justify-between items-center w-full md:w-1/2">
              <span>Remise:</span>
              <div className="flex items-center">
                <Input
                  type="number"
                  min={0}
                  className="w-20 text-right"
                  value={formData.discount}
                  onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                />
                <span className="ml-2">€</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center w-full md:w-1/2">
              <span>TVA ({formData.taxRate}%):</span>
              <span className="font-medium">
                {formData.taxAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
            
            <div className="flex justify-between w-full md:w-1/2 text-lg font-bold">
              <span>Total:</span>
              <span>
                {formData.total.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </span>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="h-4 w-4 mr-2" /> Créer la facture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
