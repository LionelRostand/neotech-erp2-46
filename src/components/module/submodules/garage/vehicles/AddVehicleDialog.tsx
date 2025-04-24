
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';
import { toast } from 'sonner';
import { Loader2 } from "lucide-react";

interface AddVehicleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleAdded?: () => void;
}

const AddVehicleDialog: React.FC<AddVehicleDialogProps> = ({
  isOpen,
  onOpenChange,
  onVehicleAdded
}) => {
  const { addVehicle, loading: vehicleLoading } = useGarageVehicles();
  const { clients, isLoading: clientsLoading } = useGarageClients();
  const [formData, setFormData] = React.useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    licensePlate: '',
    clientId: '',
    mileage: 0,
    vin: '',
    color: '',
    lastService: '',
    nextService: '',
    lastCheckDate: '',
    status: 'active' as const,
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState<{[key: string]: string}>({});

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.make.trim()) errors.make = 'La marque est requise';
    if (!formData.model.trim()) errors.model = 'Le modèle est requis';
    if (!formData.licensePlate.trim()) errors.licensePlate = 'L\'immatriculation est requise';
    if (!formData.clientId) errors.clientId = 'Le client est requis';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'year' || name === 'mileage' ? Number(value) : value 
    }));
    
    // Effacer l'erreur pour ce champ s'il est rempli
    if (formErrors[name] && value.trim()) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('Soumission du formulaire avec les données:', formData);
      await addVehicle(formData);
      
      if (onVehicleAdded) {
        onVehicleAdded();
      }
      
      // Réinitialiser le formulaire
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        licensePlate: '',
        clientId: '',
        mileage: 0,
        vin: '',
        color: '',
        lastService: '',
        nextService: '',
        lastCheckDate: '',
        status: 'active',
        notes: ''
      });
      
      onOpenChange(false);
      toast.success('Véhicule ajouté avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du véhicule:', error);
      toast.error('Erreur lors de l\'ajout du véhicule');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!isSubmitting) {
        onOpenChange(open);
        if (!open) {
          // Réinitialiser les erreurs et le formulaire lors de la fermeture
          setFormErrors({});
          setFormData({
            make: '',
            model: '',
            year: new Date().getFullYear(),
            licensePlate: '',
            clientId: '',
            mileage: 0,
            vin: '',
            color: '',
            lastService: '',
            nextService: '',
            lastCheckDate: '',
            status: 'active',
            notes: ''
          });
        }
      }
    }}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouveau Véhicule</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="make" className={formErrors.make ? "text-destructive" : ""}>
              Marque *
            </Label>
            <Input
              id="make"
              name="make"
              value={formData.make}
              onChange={handleInputChange}
              className={formErrors.make ? "border-destructive" : ""}
              disabled={isSubmitting}
              required
            />
            {formErrors.make && (
              <p className="text-xs text-destructive">{formErrors.make}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="model" className={formErrors.model ? "text-destructive" : ""}>
              Modèle *
            </Label>
            <Input
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              className={formErrors.model ? "border-destructive" : ""}
              disabled={isSubmitting}
              required
            />
            {formErrors.model && (
              <p className="text-xs text-destructive">{formErrors.model}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Année *</Label>
            <Input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="licensePlate" className={formErrors.licensePlate ? "text-destructive" : ""}>
              Immatriculation *
            </Label>
            <Input
              id="licensePlate"
              name="licensePlate"
              value={formData.licensePlate}
              onChange={handleInputChange}
              className={formErrors.licensePlate ? "border-destructive" : ""}
              disabled={isSubmitting}
              required
            />
            {formErrors.licensePlate && (
              <p className="text-xs text-destructive">{formErrors.licensePlate}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="mileage">Kilométrage *</Label>
            <Input
              id="mileage"
              name="mileage"
              type="number"
              value={formData.mileage}
              onChange={handleInputChange}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientId" className={formErrors.clientId ? "text-destructive" : ""}>
              Client *
            </Label>
            <Select 
              value={formData.clientId} 
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, clientId: value }));
                if (formErrors.clientId) {
                  setFormErrors(prev => {
                    const updated = { ...prev };
                    delete updated.clientId;
                    return updated;
                  });
                }
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger className={formErrors.clientId ? "border-destructive" : ""}>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clientsLoading ? (
                  <SelectItem value="loading" disabled>Chargement des clients...</SelectItem>
                ) : clients.length === 0 ? (
                  <SelectItem value="empty" disabled>Aucun client disponible</SelectItem>
                ) : (
                  clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.firstName} {client.lastName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {formErrors.clientId && (
              <p className="text-xs text-destructive">{formErrors.clientId}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastCheckDate">Dernier contrôle</Label>
            <Input
              id="lastCheckDate"
              name="lastCheckDate"
              type="date"
              value={formData.lastCheckDate}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isSubmitting}
          >
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Ajout en cours...
              </>
            ) : (
              'Ajouter le véhicule'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleDialog;
