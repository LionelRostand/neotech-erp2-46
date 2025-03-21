
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Heart } from "lucide-react";
import { LoyaltyClient } from "../../inventory/types/inventory-types";

interface AddPointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: LoyaltyClient[];
  onAddPoints: (clientId: string, points: number, reason: string) => void;
}

const AddPointsDialog: React.FC<AddPointsDialogProps> = ({ 
  open, 
  onOpenChange,
  clients,
  onAddPoints
}) => {
  const { toast } = useToast();
  const [selectedClient, setSelectedClient] = useState<string>("");
  const [points, setPoints] = useState<number>(10);
  const [reason, setReason] = useState<string>("Visite");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient) {
      toast({
        title: "Client requis",
        description: "Veuillez sélectionner un client",
        variant: "destructive"
      });
      return;
    }

    if (points <= 0) {
      toast({
        title: "Points invalides",
        description: "Le nombre de points doit être supérieur à 0",
        variant: "destructive"
      });
      return;
    }

    onAddPoints(selectedClient, points, reason);
    
    // Reset form
    setSelectedClient("");
    setPoints(10);
    setReason("Visite");
    
    // Close dialog
    onOpenChange(false);
    
    toast({
      title: "Points ajoutés",
      description: `${points} points ont été ajoutés avec succès`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Ajouter des points
          </DialogTitle>
          <DialogDescription>
            Ajoutez des points de fidélité à un client
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Select 
                value={selectedClient} 
                onValueChange={setSelectedClient}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name} ({client.points} points)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="points">Points à ajouter</Label>
              <Input
                id="points"
                type="number"
                min="1"
                value={points}
                onChange={(e) => setPoints(Number(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Raison</Label>
              <Select value={reason} onValueChange={setReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une raison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Visite">Visite</SelectItem>
                  <SelectItem value="Achat de produits">Achat de produits</SelectItem>
                  <SelectItem value="Parrainage">Parrainage</SelectItem>
                  <SelectItem value="Anniversaire">Anniversaire</SelectItem>
                  <SelectItem value="Promotion">Promotion spéciale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit">
              Ajouter les points
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPointsDialog;
