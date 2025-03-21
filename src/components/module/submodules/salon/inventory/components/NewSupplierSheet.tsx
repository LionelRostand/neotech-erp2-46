
import React, { useState } from 'react';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NewSupplier } from '../types/inventory-types';

interface NewSupplierSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSupplier: (supplier: NewSupplier) => boolean;
}

export const NewSupplierSheet: React.FC<NewSupplierSheetProps> = ({ 
  isOpen, 
  onClose, 
  onAddSupplier 
}) => {
  const [newSupplier, setNewSupplier] = useState<NewSupplier>({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateSupplier = () => {
    const success = onAddSupplier(newSupplier);
    if (success) {
      onClose();
      // Reset form
      setNewSupplier({
        name: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Ajouter un fournisseur</SheetTitle>
          <SheetDescription>
            Ajoutez un nouveau fournisseur pour vos produits de salon.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="supplier-name">Nom de l'entreprise*</Label>
            <Input
              id="supplier-name"
              name="name"
              value={newSupplier.name}
              onChange={handleInputChange}
              placeholder="L'Oréal Professional, Schwarzkopf, etc."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-name">Nom du contact</Label>
            <Input
              id="contact-name"
              name="contactName"
              value={newSupplier.contactName}
              onChange={handleInputChange}
              placeholder="Jean Dupont"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email*</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={newSupplier.email}
              onChange={handleInputChange}
              placeholder="contact@fournisseur.fr"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone*</Label>
            <Input
              id="phone"
              name="phone"
              value={newSupplier.phone}
              onChange={handleInputChange}
              placeholder="01 23 45 67 89"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              value={newSupplier.address}
              onChange={handleInputChange}
              placeholder="14 Rue Royale, 75008 Paris"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={newSupplier.notes}
              onChange={handleInputChange}
              placeholder="Notes supplémentaires sur ce fournisseur..."
              rows={3}
            />
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Annuler</Button>
          </SheetClose>
          <Button onClick={handleCreateSupplier}>Ajouter</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
