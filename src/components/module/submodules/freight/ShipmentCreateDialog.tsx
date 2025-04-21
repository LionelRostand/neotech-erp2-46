
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shipment, ShipmentLine } from '@/types/freight';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createShipment } from './services/shipmentService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ShipmentCreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

const ShipmentCreateDialog: React.FC<ShipmentCreateDialogProps> = ({ 
  isOpen, 
  onClose, 
  onCreated 
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [newShipment, setNewShipment] = useState<Partial<Shipment>>({
    reference: '',
    customer: '',
    origin: '',
    destination: '',
    carrier: '',
    carrierName: '',
    shipmentType: 'import',
    status: 'draft',
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedDeliveryDate: new Date().toISOString().split('T')[0],
    lines: [],
    totalWeight: 0,
    notes: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewShipment(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setNewShipment(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Create a full shipment object from the partial one
      const shipmentToCreate: Omit<Shipment, 'id' | 'createdAt'> = {
        ...newShipment as any,
        reference: newShipment.reference || `EXP-${Date.now().toString().slice(-6)}`,
        lines: newShipment.lines || [],
        totalWeight: newShipment.totalWeight || 0
      };
      
      await createShipment(shipmentToCreate);
      toast.success('Expédition créée avec succès !');
      
      if (onCreated) {
        onCreated();
      } else {
        onClose();
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error('Erreur lors de la création de l\'expédition');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nouvelle expédition</DialogTitle>
          <DialogDescription>
            Créez une nouvelle expédition en remplissant le formulaire ci-dessous
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                name="reference"
                value={newShipment.reference}
                onChange={handleChange}
                placeholder="Auto-généré si vide"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customer">Client</Label>
              <Input
                id="customer"
                name="customer"
                value={newShipment.customer}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="origin">Origine</Label>
              <Input
                id="origin"
                name="origin"
                value={newShipment.origin}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                value={newShipment.destination}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carrierName">Transporteur</Label>
              <Input
                id="carrierName"
                name="carrierName"
                value={newShipment.carrierName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shipmentType">Type d'expédition</Label>
              <Select
                value={newShipment.shipmentType}
                onValueChange={(value) => handleSelectChange('shipmentType', value)}
              >
                <SelectTrigger id="shipmentType">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import">Import</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="local">Local</SelectItem>
                  <SelectItem value="international">International</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Date prévue</Label>
              <Input
                id="scheduledDate"
                name="scheduledDate"
                type="date"
                value={newShipment.scheduledDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedDeliveryDate">Date de livraison estimée</Label>
              <Input
                id="estimatedDeliveryDate"
                name="estimatedDeliveryDate"
                type="date"
                value={newShipment.estimatedDeliveryDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={newShipment.notes || ''}
                onChange={handleChange}
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer l'expédition
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentCreateDialog;
