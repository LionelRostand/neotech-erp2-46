
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FilePenLine, Plus, Send, Trash } from "lucide-react";
import { toast } from 'sonner';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock reservation and client data
const mockReservations = [
  { id: 'RES-001', clientName: 'Martin Dupont', vehicle: 'Renault Clio', dates: '01/07/2023 - 07/07/2023' },
  { id: 'RES-002', clientName: 'Sophie Durand', vehicle: 'Peugeot 208', dates: '05/07/2023 - 12/07/2023' },
  { id: 'RES-003', clientName: 'Entreprise ABC', vehicle: 'Citroën C5', dates: '10/07/2023 - 15/07/2023' },
  { id: 'RES-004', clientName: 'Jean Lefebvre', vehicle: 'Volkswagen Golf', dates: '15/07/2023 - 22/07/2023' },
  { id: 'RES-005', clientName: 'Marie Robert', vehicle: 'Renault Captur', dates: '20/07/2023 - 25/07/2023' },
];

// Interface for invoice items
interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({ open, onOpenChange }) => {
  const [selectedReservation, setSelectedReservation] = useState<string>('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: 'Location de véhicule',
      quantity: 1,
      unitPrice: 0,
      taxRate: 20,
      total: 0
    }
  ]);
  
  // Calculate totals
  const subtotal = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
  const total = subtotal + taxAmount;

  // Format currency in EUR
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  // Update item calculations
  const updateItemCalculations = (items: InvoiceItem[]): InvoiceItem[] => {
    return items.map(item => ({
      ...item,
      total: item.quantity * item.unitPrice * (1 + item.taxRate / 100)
    }));
  };

  // Update an item
  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const newItems = invoiceItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate total
        if (field === 'quantity' || field === 'unitPrice' || field === 'taxRate') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice * (1 + updatedItem.taxRate / 100);
        }
        return updatedItem;
      }
      return item;
    });
    setInvoiceItems(newItems);
  };

  // Add a new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 20,
      total: 0
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  // Remove an item
  const removeItem = (id: string) => {
    if (invoiceItems.length <= 1) {
      toast.error("Une facture doit contenir au moins un article");
      return;
    }
    setInvoiceItems(invoiceItems.filter(item => item.id !== id));
  };

  // Handle form submission
  const handleSubmit = (asDraft: boolean = false) => {
    console.log('Creating invoice:', {
      reservation: selectedReservation,
      items: invoiceItems,
      status: asDraft ? 'draft' : 'sent',
      subtotal,
      taxAmount,
      total
    });
    
    toast.success(asDraft 
      ? "Facture enregistrée comme brouillon" 
      : "Facture créée et envoyée au client"
    );
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reservation">Réservation</Label>
              <Select value={selectedReservation} onValueChange={setSelectedReservation}>
                <SelectTrigger id="reservation">
                  <SelectValue placeholder="Sélectionner une réservation" />
                </SelectTrigger>
                <SelectContent>
                  {mockReservations.map(res => (
                    <SelectItem key={res.id} value={res.id}>
                      {res.id} - {res.clientName} ({res.vehicle})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="issueDate">Date d'émission</Label>
              <Input 
                id="issueDate" 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]} 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Input 
                id="dueDate" 
                type="date" 
                defaultValue={new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]} 
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Numéro de facture</Label>
              <Input id="invoiceNumber" defaultValue="FACT-2023-0009" readOnly />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select defaultValue="EUR">
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">Dollar US ($)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentTerm">Conditions de paiement</Label>
              <Select defaultValue="30">
                <SelectTrigger id="paymentTerm">
                  <SelectValue placeholder="Conditions de paiement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                  <SelectItem value="45">45 jours</SelectItem>
                  <SelectItem value="60">60 jours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-medium">Articles</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Description</TableHead>
                <TableHead className="text-right">Quantité</TableHead>
                <TableHead className="text-right">Prix unitaire</TableHead>
                <TableHead className="text-right">TVA (%)</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Input 
                      value={item.description} 
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Description de l'article" 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input 
                      type="number" 
                      min="1" 
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value, 10) || 0)}
                      className="w-20 ml-auto" 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input 
                      type="number" 
                      min="0" 
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-28 ml-auto" 
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Input 
                      type="number" 
                      min="0" 
                      max="100"
                      value={item.taxRate}
                      onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)}
                      className="w-20 ml-auto" 
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.total)}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <Button variant="outline" className="w-full" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un article
          </Button>
          
          <div className="flex justify-end">
            <div className="w-[300px] space-y-2">
              <div className="flex justify-between">
                <span>Sous-total:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>TVA:</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" placeholder="Notes ou commentaires pour la facture" />
          </div>
        </div>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="secondary" onClick={() => handleSubmit(true)}>
            <FilePenLine className="mr-2 h-4 w-4" /> Enregistrer comme brouillon
          </Button>
          <Button onClick={() => handleSubmit(false)}>
            <Send className="mr-2 h-4 w-4" /> Créer et envoyer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
