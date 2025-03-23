
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { SalonService } from '../../types/salon-types';

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: SalonService;
  onUpdate: (service: SalonService) => void;
}

const EditServiceDialog: React.FC<EditServiceDialogProps> = ({
  open,
  onOpenChange,
  service,
  onUpdate
}) => {
  const [updatedService, setUpdatedService] = useState<SalonService>({...service});

  const handleChange = (field: keyof SalonService, value: any) => {
    setUpdatedService(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(updatedService);
    onOpenChange(false);
  };

  // Liste des catégories disponibles (normalement viendraient d'une API)
  const categories = [
    "Coupes", "Coloration", "Soins capillaires", "Coiffure", "Traitement", "Autre"
  ];

  // Liste des coiffeurs disponibles (normalement viendraient d'une API)
  const availableStylists = [
    "Sophie Martin", "Thomas Dubois", "Julie Lambert", "Alexandre Petit"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Modifier le service</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du service</Label>
            <Input 
              id="name" 
              value={updatedService.name} 
              onChange={(e) => handleChange('name', e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={updatedService.description} 
              onChange={(e) => handleChange('description', e.target.value)} 
              rows={3} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select 
                value={updatedService.category}
                onValueChange={(value) => handleChange('category', value)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (minutes)</Label>
              <Input 
                id="duration" 
                type="number" 
                min="5" 
                step="5" 
                value={updatedService.duration} 
                onChange={(e) => handleChange('duration', parseInt(e.target.value))} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Prix (€)</Label>
              <Input 
                id="price" 
                type="number" 
                min="0" 
                step="0.01" 
                value={updatedService.price} 
                onChange={(e) => handleChange('price', parseFloat(e.target.value))} 
                required 
              />
            </div>
            
            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="available" 
                  checked={updatedService.available} 
                  onCheckedChange={(checked) => handleChange('available', checked)} 
                />
                <Label htmlFor="available">Service actif</Label>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Coiffeurs spécialisés</Label>
            <div className="border rounded-md p-3 space-y-2">
              <p className="text-sm text-muted-foreground mb-2">
                Sélectionnez les coiffeurs spécialisés pour ce service ou laissez vide pour tous les coiffeurs
              </p>
              
              {availableStylists.map(stylist => {
                const isSelected = updatedService.specialists?.includes(stylist) || false;
                
                return (
                  <div key={stylist} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`stylist-${stylist}`} 
                      checked={isSelected}
                      onChange={(e) => {
                        const currentSpecialists = updatedService.specialists || [];
                        let newSpecialists;
                        
                        if (e.target.checked) {
                          newSpecialists = [...currentSpecialists, stylist];
                        } else {
                          newSpecialists = currentSpecialists.filter(s => s !== stylist);
                        }
                        
                        handleChange('specialists', newSpecialists);
                      }}
                      className="h-4 w-4 rounded"
                    />
                    <label htmlFor={`stylist-${stylist}`} className="text-sm">{stylist}</label>
                  </div>
                );
              })}
            </div>
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

export default EditServiceDialog;
