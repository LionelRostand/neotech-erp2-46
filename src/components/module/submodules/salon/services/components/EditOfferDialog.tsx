
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "lucide-react";

interface SpecialOffer {
  id: string;
  name: string;
  description: string;
  discount: number;
  validUntil: string;
  conditions: string;
  isActive: boolean;
}

interface EditOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: SpecialOffer;
  onUpdate: (offer: SpecialOffer) => void;
}

const EditOfferDialog: React.FC<EditOfferDialogProps> = ({
  open,
  onOpenChange,
  offer,
  onUpdate
}) => {
  const [updatedOffer, setUpdatedOffer] = useState<SpecialOffer>({...offer});

  const handleChange = (field: keyof SpecialOffer, value: any) => {
    setUpdatedOffer(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(updatedOffer);
    onOpenChange(false);
  };

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Modifier l'offre</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'offre</Label>
            <Input 
              id="name" 
              value={updatedOffer.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={updatedOffer.description} 
              onChange={(e) => handleChange('description', e.target.value)} 
              rows={3} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount">Réduction (%)</Label>
              <Input 
                id="discount" 
                type="number" 
                min="0" 
                max="100" 
                value={updatedOffer.discount} 
                onChange={(e) => handleChange('discount', parseInt(e.target.value))} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="validUntil">Valable jusqu'au</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input 
                  id="validUntil" 
                  type="date" 
                  value={formatDateForInput(updatedOffer.validUntil)} 
                  onChange={(e) => handleChange('validUntil', e.target.value)} 
                  className="pl-10" 
                  required 
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="conditions">Conditions d'utilisation</Label>
            <Textarea 
              id="conditions" 
              value={updatedOffer.conditions} 
              onChange={(e) => handleChange('conditions', e.target.value)} 
              rows={3} 
              placeholder="Conditions d'application de l'offre..."
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="active" 
              checked={updatedOffer.isActive} 
              onCheckedChange={(checked) => handleChange('isActive', checked)} 
            />
            <Label htmlFor="active">Offre active</Label>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOfferDialog;
