
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
import { addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';

interface ContainerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

const ContainerFormDialog: React.FC<ContainerFormDialogProps> = ({ isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    number: '',
    type: '',
    size: '',
    status: 'empty',
    carrier: '',
    carrierName: '',
    origin: '',
    destination: '',
    departureDate: '',
    arrivalDate: ''
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Générer un ID unique
      const containerData = {
        ...formData,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };
      
      // Ajouter le conteneur à Firebase
      await addDocument(COLLECTIONS.FREIGHT.CONTAINERS, containerData);
      
      toast({
        title: "Conteneur créé",
        description: `Le conteneur ${formData.number} a été créé avec succès.`,
      });
      
      onSave();
      onClose();
    } catch (error) {
      console.error("Erreur lors de la création du conteneur:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le conteneur. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
  
  const containerSizes = [
    "20ft",
    "40ft",
    "45ft",
    "53ft"
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
              <Label htmlFor="size">Taille</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => handleSelectChange('size', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une taille" />
                </SelectTrigger>
                <SelectContent>
                  {containerSizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectItem value="empty">Vide</SelectItem>
                  <SelectItem value="loading">En chargement</SelectItem>
                  <SelectItem value="loaded">Chargé</SelectItem>
                  <SelectItem value="in_transit">En transit</SelectItem>
                  <SelectItem value="delivered">Livré</SelectItem>
                  <SelectItem value="returned">Retourné</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carrierName">Transporteur</Label>
              <Input
                id="carrierName"
                name="carrierName"
                placeholder="Nom du transporteur"
                value={formData.carrierName}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="origin">Origine</Label>
              <Input
                id="origin"
                name="origin"
                placeholder="Ville, Pays"
                value={formData.origin}
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
              <Label htmlFor="departureDate">Date de départ</Label>
              <Input
                id="departureDate"
                name="departureDate"
                type="date"
                value={formData.departureDate}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="arrivalDate">Date d'arrivée estimée</Label>
              <Input
                id="arrivalDate"
                name="arrivalDate"
                type="date"
                value={formData.arrivalDate}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Création en cours..." : "Créer le conteneur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerFormDialog;
