
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
import { Textarea } from "@/components/ui/textarea";
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
import { Calendar, Plus, FilePenLine, Send, Trash } from "lucide-react";
import { toast } from 'sonner';

interface CreateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (invoice: any) => void;
  clientsMap: Record<string, string>;
  vehiclesMap: Record<string, string>;
  repairs: any[];
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  total: number;
}

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  clientsMap,
  vehiclesMap,
  repairs
}) => {
  const [clientId, setClientId] = useState<string>('');
  const [vehicleId, setVehicleId] = useState<string>('');
  const [repairId, setRepairId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: 'Prestation de service',
      quantity: 1,
      unitPrice: 0,
      taxRate: 20,
      total: 0
    }
  ]);
  
  // Calculate totals
  const amount = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const taxAmount = invoiceItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice * item.taxRate / 100), 0);
  const total = amount + taxAmount;

  // Format currency in EUR
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
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

  // Handle repair selection
  const handleRepairSelection = (selectedRepairId: string) => {
    setRepairId(selectedRepairId);
    
    // Find the selected repair
    const selectedRepair = repairs.find(r => r.id === selectedRepairId);
    if (selectedRepair) {
      // Set client and vehicle from repair
      setClientId(selectedRepair.clientId);
      setVehicleId(selectedRepair.vehicleId);
      
      // Set initial invoice item from repair
      setInvoiceItems([
        {
          id: '1',
          description: selectedRepair.description,
          quantity: 1,
          unitPrice: selectedRepair.estimatedCost,
          taxRate: 20,
          total: selectedRepair.estimatedCost * 1.2
        }
      ]);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault();

    if (!clientId || !vehicleId) {
      toast.error("Veuillez sélectionner un client et un véhicule");
      return;
    }

    if (invoiceItems.some(item => !item.description || item.quantity <= 0)) {
      toast.error("Veuillez remplir correctement tous les articles");
      return;
    }

    const newInvoice = {
      clientId,
      vehicleId,
      repairId,
      date,
      dueDate,
      amount,
      tax: taxAmount,
      total,
      status: asDraft ? "draft" : "unpaid",
      notes,
      items: invoiceItems,
      repairs: [repairId]
    };

    onSave(newInvoice);
    toast.success(asDraft ? "Facture enregistrée comme brouillon" : "Facture créée avec succès");
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setClientId('');
    setVehicleId('');
    setRepairId('');
    setDate(new Date().toISOString().split('T')[0]);
    setDueDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setNotes('');
    setInvoiceItems([
      {
        id: '1',
        description: 'Prestation de service',
        quantity: 1,
        unitPrice: 0,
        taxRate: 20,
        total: 0
      }
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="repair">Réparation liée</Label>
              <Select value={repairId} onValueChange={handleRepairSelection}>
                <SelectTrigger id="repair">
                  <SelectValue placeholder="Sélectionner une réparation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune réparation liée</SelectItem>
                  {repairs.filter(r => r.status === "completed" || r.status === "in_progress").map(repair => (
                    <SelectItem key={repair.id} value={repair.id}>
                      {repair.id} - {repair.description.substring(0, 30)}{repair.description.length > 30 ? '...' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="invoiceNumber">Numéro de facture</Label>
              <Input id="invoiceNumber" defaultValue="Automatique" readOnly className="bg-muted" />
            </div>
            
            <div>
              <Label htmlFor="client">Client</Label>
              <Select value={clientId} onValueChange={setClientId} disabled={!!repairId}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(clientsMap).map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="vehicle">Véhicule</Label>
              <Select value={vehicleId} onValueChange={setVehicleId} disabled={!!repairId}>
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(vehiclesMap).map(([id, name]) => (
                    <SelectItem key={id} value={id}>{name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date">Date d'émission</Label>
              <div className="relative">
                <Input 
                  id="date" 
                  type="date" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <div className="relative">
                <Input 
                  id="dueDate" 
                  type="date" 
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
                <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
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
                        type="button"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <Button variant="outline" className="w-full" onClick={addItem} type="button">
              <Plus className="mr-2 h-4 w-4" /> Ajouter un article
            </Button>
            
            <div className="flex justify-end">
              <div className="w-[300px] space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total:</span>
                  <span>{formatCurrency(amount)}</span>
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
              <Textarea 
                id="notes" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes ou commentaires pour la facture" 
              />
            </div>
          </div>
          
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => onOpenChange(false)} type="button">
              Annuler
            </Button>
            <Button variant="secondary" onClick={(e) => handleSubmit(e, true)} type="button">
              <FilePenLine className="mr-2 h-4 w-4" /> Enregistrer comme brouillon
            </Button>
            <Button type="submit">
              <Send className="mr-2 h-4 w-4" /> Créer la facture
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
