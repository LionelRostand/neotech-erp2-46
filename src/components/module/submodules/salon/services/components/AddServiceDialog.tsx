
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useServiceForm } from '../hooks/useServiceForm';
import { useToast } from '@/hooks/use-toast';

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddServiceDialog: React.FC<AddServiceDialogProps> = ({ open, onOpenChange }) => {
  const { formData, formErrors, stylists, handleChange, handleSubmit, isValid } = useServiceForm();
  const { toast } = useToast();

  const onSubmit = () => {
    if (handleSubmit()) {
      onOpenChange(false);
      toast({
        title: "Service ajouté",
        description: "Le service a été ajouté avec succès."
      });
    }
  };

  const handleSpecialistChange = (stylistName: string, checked: boolean) => {
    const currentSpecialists = [...formData.specialists];
    
    if (checked) {
      // Add the stylist if not already in the array
      if (!currentSpecialists.includes(stylistName)) {
        currentSpecialists.push(stylistName);
      }
    } else {
      // Remove the stylist from the array
      const index = currentSpecialists.indexOf(stylistName);
      if (index !== -1) {
        currentSpecialists.splice(index, 1);
      }
    }
    
    handleChange('specialists', currentSpecialists);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter un service</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nom du service *</Label>
            <Input
              id="name"
              placeholder="Coupe et brushing"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Courte description du service"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Prix (€) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="45"
                value={formData.price || ''}
                onChange={(e) => handleChange('price', e.target.value)}
              />
              {formErrors.price && <p className="text-sm text-destructive">{formErrors.price}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration">Durée (min) *</Label>
              <Input
                id="duration"
                type="number"
                placeholder="60"
                value={formData.duration || ''}
                onChange={(e) => handleChange('duration', e.target.value)}
              />
              {formErrors.duration && <p className="text-sm text-destructive">{formErrors.duration}</p>}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coupe">Coupe</SelectItem>
                <SelectItem value="coloration">Coloration</SelectItem>
                <SelectItem value="technique">Technique</SelectItem>
                <SelectItem value="coiffage">Coiffage</SelectItem>
                <SelectItem value="soin">Soin</SelectItem>
                <SelectItem value="homme">Homme</SelectItem>
                <SelectItem value="enfant">Enfant</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.category && <p className="text-sm text-destructive">{formErrors.category}</p>}
          </div>

          <div className="grid gap-2">
            <Label>Coiffeurs spécialisés</Label>
            <div className="grid grid-cols-2 gap-2">
              {stylists.map((stylist) => (
                <div key={stylist.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`stylist-${stylist.id}`} 
                    checked={formData.specialists.includes(`${stylist.firstName}`)}
                    onCheckedChange={(checked) => 
                      handleSpecialistChange(stylist.firstName, checked === true)
                    }
                  />
                  <Label 
                    htmlFor={`stylist-${stylist.id}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {stylist.firstName}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button type="submit" disabled={!isValid} onClick={onSubmit}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;
