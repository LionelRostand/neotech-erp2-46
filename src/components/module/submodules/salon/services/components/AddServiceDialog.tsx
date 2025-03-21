
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useServiceForm } from '../hooks/useServiceForm';

interface AddServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddServiceDialog: React.FC<AddServiceDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const { formData, formErrors, stylists, handleChange, handleSubmit, isValid } = useServiceForm();
  
  const onSubmit = () => {
    if (handleSubmit()) {
      toast({
        title: "Service ajouté",
        description: "Le service a été ajouté avec succès"
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un service</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du service *</Label>
            <Input
              id="name"
              placeholder="Coupe & Brushing"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
            {formErrors.name && (
              <p className="text-sm text-destructive">{formErrors.name}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description détaillée du service"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (€) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="30"
                value={formData.price === 0 ? '' : formData.price.toString()}
                onChange={(e) => handleChange('price', e.target.value)}
              />
              {formErrors.price && (
                <p className="text-sm text-destructive">{formErrors.price}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (min) *</Label>
              <Input
                id="duration"
                type="number"
                placeholder="45"
                value={formData.duration === 0 ? '' : formData.duration.toString()}
                onChange={(e) => handleChange('duration', e.target.value)}
              />
              {formErrors.duration && (
                <p className="text-sm text-destructive">{formErrors.duration}</p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie *</Label>
            <Select 
              value={formData.category || "uncategorized"} 
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="uncategorized">Non catégorisé</SelectItem>
                <SelectItem value="coupe">Coupe</SelectItem>
                <SelectItem value="coloration">Coloration</SelectItem>
                <SelectItem value="technique">Technique</SelectItem>
                <SelectItem value="coiffage">Coiffage</SelectItem>
                <SelectItem value="soin">Soin</SelectItem>
                <SelectItem value="homme">Homme</SelectItem>
              </SelectContent>
            </Select>
            {formErrors.category && (
              <p className="text-sm text-destructive">{formErrors.category}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialists">Coiffeurs spécialisés</Label>
            <Select 
              value={formData.specialists.length > 0 ? "selected" : "all"} 
              onValueChange={(value) => {
                if (value === "all") {
                  handleChange('specialists', []);
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner des coiffeurs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les coiffeurs</SelectItem>
                <SelectItem value="selected">Coiffeurs sélectionnés</SelectItem>
              </SelectContent>
            </Select>
            
            {formData.specialists.length > 0 && (
              <div className="mt-2 space-y-2">
                {stylists.map(stylist => (
                  <div key={stylist.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`stylist-${stylist.id}`}
                      checked={formData.specialists.includes(stylist.firstName)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleChange('specialists', [...formData.specialists, stylist.firstName]);
                        } else {
                          handleChange('specialists', formData.specialists.filter(s => s !== stylist.firstName));
                        }
                      }}
                      className="h-4 w-4 rounded border-gray-300 text-primary"
                    />
                    <Label htmlFor={`stylist-${stylist.id}`} className="text-sm font-normal cursor-pointer">
                      {stylist.firstName} {stylist.lastName}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button onClick={onSubmit} disabled={!isValid}>
            Ajouter
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceDialog;
