
import React, { useState } from 'react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Supplier, NewOrder } from '../types/inventory-types';

interface NewOrderSheetProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  onCreateOrder: (order: NewOrder) => boolean;
}

export const NewOrderSheet: React.FC<NewOrderSheetProps> = ({ 
  isOpen, 
  onClose, 
  suppliers, 
  onCreateOrder 
}) => {
  const [newOrder, setNewOrder] = useState<NewOrder>({
    supplierId: '',
    products: [],
    notes: '',
    expectedDeliveryDate: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateOrder = () => {
    const success = onCreateOrder(newOrder);
    if (success) {
      onClose();
      // Reset form
      setNewOrder({
        supplierId: '',
        products: [],
        notes: '',
        expectedDeliveryDate: ''
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Créer une commande</SheetTitle>
          <SheetDescription>
            Créez une nouvelle commande auprès d'un fournisseur.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="supplier-select">Fournisseur*</Label>
            <Select
              value={newOrder.supplierId}
              onValueChange={(value) => handleSelectChange('supplierId', value)}
            >
              <SelectTrigger id="supplier-select">
                <SelectValue placeholder="Sélectionner un fournisseur" />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map(supplier => (
                  <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expected-delivery">Date de livraison prévue</Label>
            <Input
              id="expected-delivery"
              name="expectedDeliveryDate"
              type="date"
              value={newOrder.expectedDeliveryDate}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order-notes">Notes</Label>
            <Textarea
              id="order-notes"
              name="notes"
              value={newOrder.notes}
              onChange={handleInputChange}
              placeholder="Notes supplémentaires sur cette commande..."
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              * Dans une version complète, vous pourriez sélectionner des produits à commander ici.
            </p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Annuler</Button>
          </SheetClose>
          <Button onClick={handleCreateOrder}>Créer la commande</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
