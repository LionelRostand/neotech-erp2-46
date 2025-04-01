
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ContainerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (container: any) => void;
}

const ContainerFormDialog: React.FC<ContainerFormDialogProps> = ({ isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    number: '',
    type: '',
    location: '',
    destination: '',
    client: '',
    departure: '',
    arrival: '',
    status: 'ready'
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Générer un ID unique
    const newContainer = {
      id: `CONT${Math.floor(100000 + Math.random() * 900000)}`,
      ...formData
    };
    
    onSave(newContainer);
    toast({
      title: "Conteneur créé",
      description: `Le conteneur ${newContainer.number} a été créé avec succès.`,
    });
    onClose();
  };
  
  const containerTypes = [
    "20ft Standard",
    "40ft Standard",
    "40ft High Cube",
    "20ft Refrigerated",
    "40ft Refrigerated",
    "20ft Open Top",
    "40ft Open Top",
    "20ft Flat Rack",
    "40ft Flat Rack"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Nouveau Conteneur</DialogTitle>
          <DialogDescription>
            Créez un nouveau conteneur en remplissant le formulaire ci-dessous.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Numéro du conteneur</Label>
              <Input
                id="number"
                name="number"
                placeholder="CON12345678"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Type de conteneur</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  {containerTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Client</Label>
              <Input
                id="client"
                name="client"
                placeholder="Nom du client"
                value={formData.client}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ready">Prêt</SelectItem>
                  <SelectItem value="loading">En chargement</SelectItem>
                  <SelectItem value="in_transit">En transit</SelectItem>
                  <SelectItem value="customs">En douane</SelectItem>
                  <SelectItem value="delivered">Livré</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Localisation actuelle</Label>
              <Input
                id="location"
                name="location"
                placeholder="Ville, Pays"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                placeholder="Ville, Pays"
                value={formData.destination}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departure">Date de départ</Label>
              <Input
                id="departure"
                name="departure"
                type="date"
                value={formData.departure}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="arrival">Date d'arrivée estimée</Label>
              <Input
                id="arrival"
                name="arrival"
                type="date"
                value={formData.arrival}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              Créer le conteneur
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerFormDialog;
