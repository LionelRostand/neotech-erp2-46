
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Gift } from "lucide-react";
import { NewLoyaltyReward } from "../../inventory/types/inventory-types";

interface NewRewardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddReward: (reward: NewLoyaltyReward) => void;
}

const NewRewardDialog: React.FC<NewRewardDialogProps> = ({ 
  open, 
  onOpenChange,
  onAddReward
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<NewLoyaltyReward>({
    name: '',
    points: 50,
    description: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'points' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Champ requis",
        description: "Le nom de la récompense est requis",
        variant: "destructive"
      });
      return;
    }

    if (formData.points <= 0) {
      toast({
        title: "Points invalides",
        description: "Le nombre de points doit être supérieur à 0",
        variant: "destructive"
      });
      return;
    }

    onAddReward(formData);
    
    // Reset form
    setFormData({
      name: '',
      points: 50,
      description: ''
    });
    
    // Close dialog
    onOpenChange(false);
    
    toast({
      title: "Récompense ajoutée",
      description: "La nouvelle récompense a été ajoutée avec succès"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Nouvelle récompense
          </DialogTitle>
          <DialogDescription>
            Créez une nouvelle récompense pour le programme de fidélité
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom de la récompense</Label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: Coupe gratuite"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="points">Points requis</Label>
              <Input
                id="points"
                name="points"
                type="number"
                min="1"
                value={formData.points}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Décrivez les détails de cette récompense"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Créer la récompense
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewRewardDialog;
