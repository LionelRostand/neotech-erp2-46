
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Trash2, Plus, Link as LinkIcon } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CreateInvoiceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const mockClients = [
  { id: 'client-1', name: 'Dupont Industries' },
  { id: 'client-2', name: 'Martin Export' },
  { id: 'client-3', name: 'Petit Commerce' },
  { id: 'client-4', name: 'Tech Innovations' },
  { id: 'client-5', name: 'Mobilier Moderne' },
];

const mockShipments = [
  { id: 'SHP-2025-001', reference: 'Expédition Paris-Lyon' },
  { id: 'SHP-2025-002', reference: 'Expédition Marseille-Barcelone' },
  { id: 'SHP-2025-003', reference: 'Expédition Paris-Berlin' },
  { id: 'SHP-2025-004', reference: 'Expédition Nantes-Angers' },
  { id: 'SHP-2025-005', reference: 'Expédition Lille-Strasbourg' },
];

const CreateInvoiceDialog: React.FC<CreateInvoiceDialogProps> = ({ isOpen, onClose }) => {
  const [clientId, setClientId] = useState('');
  const [reference, setReference] = useState('FR-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0'));
  const [dueDate, setDueDate] = useState<Date>(addDays(new Date(), 30));
  const [shipmentId, setShipmentId] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const { toast } = useToast();

  const handleAddItem = () => {
    setItems([
      ...items, 
      { 
        id: `item-${items.length + 1}`, 
        description: '', 
        quantity: 1, 
        unitPrice: 0, 
        total: 0 
      }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      const newItems = items.filter(item => item.id !== id);
      setItems(newItems);
      calculateTotal(newItems);
    }
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total if quantity or unitPrice changed
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.unitPrice);
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
    calculateTotal(updatedItems);
  };

  const calculateTotal = (items: InvoiceItem[]) => {
    const total = items.reduce((sum, item) => sum + item.total, 0);
    setTotalPrice(total);
  };

  const handleSubmit = () => {
    // In a real application, this would save the invoice to a database
    toast({
      title: "Facture créée",
      description: "La facture a été créée avec succès"
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle facture</DialogTitle>
          <DialogDescription>
            Remplissez les détails pour générer une facture pour votre client.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="client">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {mockClients.map(client => (
                    <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reference">Référence</Label>
              <Input id="reference" value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Date d'échéance</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="dueDate"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, 'P', { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => {
                      setDueDate(date || addDays(new Date(), 30));
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shipment">Lier à une expédition</Label>
              <Select value={shipmentId} onValueChange={setShipmentId}>
                <SelectTrigger id="shipment" className="flex items-center">
                  <SelectValue placeholder="Sélectionner une expédition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Aucune expédition</SelectItem>
                  {mockShipments.map(shipment => (
                    <SelectItem key={shipment.id} value={shipment.id}>
                      <div className="flex items-center">
                        <LinkIcon className="h-3 w-3 mr-2 opacity-70" />
                        {shipment.reference}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Détails de la facture</h3>
            <Button variant="outline" size="sm" onClick={handleAddItem}>
              <Plus className="mr-2 h-3 w-3" />
              Ajouter une ligne
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="1"
                    placeholder="Quantité"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Prix unitaire"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.total}
                    disabled
                  />
                </div>
                <div className="col-span-1 flex justify-center">
                  <Button 
                    size="icon" 
                    variant="ghost"
                    disabled={items.length <= 1}
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-4">
              <div className="w-1/3 space-y-2">
                <div className="flex justify-between">
                  <span>Sous-total :</span>
                  <span>{totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                <div className="flex justify-between">
                  <span>TVA (20%) :</span>
                  <span>{(totalPrice * 0.2).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total :</span>
                  <span>{(totalPrice * 1.2).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Créer la facture</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInvoiceDialog;
