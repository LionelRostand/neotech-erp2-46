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
import { Shipment } from '@/types/freight';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticlesTab from './shipments/tabs/ArticlesTab';

interface ShipmentEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment;
  onSave: (updatedShipment: Shipment) => void;
}

const ShipmentEditDialog: React.FC<ShipmentEditDialogProps> = ({ 
  isOpen, 
  onClose, 
  shipment,
  onSave 
}) => {
  const { toast } = useToast();
  const [editedShipment, setEditedShipment] = useState<Shipment>({...shipment});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedShipment(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setEditedShipment(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedShipment);
    toast({
      title: "Expédition mise à jour",
      description: `Les modifications ont été enregistrées avec succès.`,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Modifier l'expédition {shipment.reference}</DialogTitle>
          <DialogDescription>
            Modifiez les détails de cette expédition
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="general" className="w-full">
          <TabsList>
            <TabsTrigger value="general">Général</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence</Label>
                  <Input
                    id="reference"
                    name="reference"
                    value={editedShipment.reference}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer">Client</Label>
                  <Input
                    id="customer"
                    name="customer"
                    value={editedShipment.customer}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="origin">Origine</Label>
                  <Input
                    id="origin"
                    name="origin"
                    value={editedShipment.origin}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    name="destination"
                    value={editedShipment.destination}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carrier">Transporteur</Label>
                  <Input
                    id="carrierName"
                    name="carrierName"
                    value={editedShipment.carrierName}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select
                    value={editedShipment.status}
                    onValueChange={(value) => handleSelectChange('status', value)}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="in_transit">En transit</SelectItem>
                      <SelectItem value="delivered">Livrée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                      <SelectItem value="delayed">Retardée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Date prévue</Label>
                  <Input
                    id="scheduledDate"
                    name="scheduledDate"
                    type="date"
                    value={format(new Date(editedShipment.scheduledDate), 'yyyy-MM-dd')}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedDeliveryDate">Date de livraison estimée</Label>
                  <Input
                    id="estimatedDeliveryDate"
                    name="estimatedDeliveryDate"
                    type="date"
                    value={format(new Date(editedShipment.estimatedDeliveryDate), 'yyyy-MM-dd')}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={editedShipment.notes || ''}
                    onChange={handleChange}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
              
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
                <Button type="submit">Enregistrer</Button>
              </DialogFooter>
            </form>
          </TabsContent>

          <TabsContent value="articles">
            <ArticlesTab lines={shipment.lines} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentEditDialog;
