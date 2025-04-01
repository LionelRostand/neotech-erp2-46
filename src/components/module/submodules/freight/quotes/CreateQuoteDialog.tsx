
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Calendar as CalendarIcon, Trash2, Plus } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import ShipmentPriceCalculator from '../ShipmentPriceCalculator';
import { cn } from '@/lib/utils';

interface CreateQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface QuoteItem {
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
  { id: 'client-6', name: 'Global Shipping' },
  { id: 'client-7', name: 'Express Logistics' },
];

const CreateQuoteDialog: React.FC<CreateQuoteDialogProps> = ({ isOpen, onClose }) => {
  const [clientId, setClientId] = useState('');
  const [validUntil, setValidUntil] = useState<Date>(addDays(new Date(), 30));
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [weight, setWeight] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [items, setItems] = useState<QuoteItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [notes, setNotes] = useState('');
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
      setItems(items.filter(item => item.id !== id));
      calculateTotal(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: string, field: keyof QuoteItem, value: string | number) => {
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

  const calculateTotal = (items: QuoteItem[]) => {
    const total = items.reduce((sum, item) => sum + item.total, 0);
    setTotalPrice(total);
  };

  const handleSubmit = () => {
    // In a real application, this would save the quote to a database
    toast({
      title: "Devis créé",
      description: "Le devis a été créé avec succès"
    });
    onClose();
  };

  const handlePriceCalculated = (price: number) => {
    // If there are no items yet, create a default one with the calculated price
    if (items.length === 1 && items[0].description === '') {
      const newItems = [
        {
          id: '1',
          description: 'Transport de marchandises',
          quantity: 1,
          unitPrice: price,
          total: price
        }
      ];
      
      setItems(newItems);
      setTotalPrice(price);
    }
  };

  // Simplified version of the shipment lines for the price calculator
  const shipmentLines = [
    {
      id: '1',
      productName: 'Marchandises diverses',
      quantity: 1,
      weight: weight || 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
      value: totalPrice,
      packageType: 'standard'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un nouveau devis</DialogTitle>
          <DialogDescription>
            Remplissez les détails pour générer un devis pour votre client.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
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
              <Label htmlFor="validUntil">Valide jusqu'au</Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="validUntil"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !validUntil && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {validUntil ? format(validUntil, 'P', { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={validUntil}
                    onSelect={(date) => {
                      setValidUntil(date || addDays(new Date(), 30));
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">Origine</Label>
              <Input id="origin" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="Ville, Pays" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Ville, Pays" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input 
                  id="weight" 
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={weight || ''}
                  onChange={(e) => setWeight(Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="volume">Volume (m³)</Label>
                <Input 
                  id="volume" 
                  type="number" 
                  min="0" 
                  step="0.01"
                  value={volume || ''}
                  onChange={(e) => setVolume(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div>
            <div className="space-y-4">
              <h3 className="font-medium">Calculateur de tarifs</h3>
              <ShipmentPriceCalculator 
                totalWeight={weight || 0}
                shipmentLines={shipmentLines}
                onPriceCalculated={handlePriceCalculated}
              />
            </div>
          </div>
        </div>

        <Separator className="my-4" />

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Détails du devis</h3>
            <Button variant="outline" size="sm" onClick={handleAddItem}>
              <Plus className="mr-2 h-3 w-3" />
              Ajouter une ligne
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
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
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total :</span>
                  <span>{totalPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSubmit}>Créer le devis</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQuoteDialog;
