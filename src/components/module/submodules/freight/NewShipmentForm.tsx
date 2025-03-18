
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import ShipmentLinesForm from './ShipmentLinesForm';
import { mockCarriers, mockRoutes } from './mockData';

interface NewShipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewShipmentForm: React.FC<NewShipmentFormProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Expédition créée",
      description: "L'expédition a été créée avec succès.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Expédition</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Informations générales</TabsTrigger>
              <TabsTrigger value="items">Articles</TabsTrigger>
              <TabsTrigger value="tracking">Suivi & Route</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence</Label>
                  <Input id="reference" placeholder="EXP-" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customer">Client</Label>
                  <Input id="customer" placeholder="Nom du client" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Type d'expédition</Label>
                  <Select defaultValue="local">
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="import">Import</SelectItem>
                      <SelectItem value="export">Export</SelectItem>
                      <SelectItem value="international">International</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="carrier">Transporteur</Label>
                  <Select>
                    <SelectTrigger id="carrier">
                      <SelectValue placeholder="Sélectionner un transporteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockCarriers.map(carrier => (
                        <SelectItem key={carrier.id} value={carrier.id}>
                          {carrier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="origin">Origine</Label>
                  <Input id="origin" placeholder="Adresse d'origine" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input id="destination" placeholder="Adresse de destination" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Date d'expédition</Label>
                  <Input id="scheduledDate" type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedDelivery">Date de livraison estimée</Label>
                  <Input id="estimatedDelivery" type="date" />
                </div>
                
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Informations complémentaires sur l'expédition..." 
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="items" className="mt-4">
              <ShipmentLinesForm />
            </TabsContent>
            
            <TabsContent value="tracking" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">Numéro de suivi</Label>
                  <Input id="trackingNumber" placeholder="Ex: TRK123456789" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Statut</Label>
                  <Select defaultValue="draft">
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Brouillon</SelectItem>
                      <SelectItem value="confirmed">Confirmée</SelectItem>
                      <SelectItem value="in_transit">En transit</SelectItem>
                      <SelectItem value="delivered">Livrée</SelectItem>
                      <SelectItem value="cancelled">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="route">Route</Label>
                  <Select>
                    <SelectTrigger id="route">
                      <SelectValue placeholder="Sélectionner une route" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockRoutes.map(route => (
                        <SelectItem key={route.id} value={route.id}>
                          {route.name} ({route.origin} → {route.destination})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transportType">Type de transport</Label>
                  <Select defaultValue="road">
                    <SelectTrigger id="transportType">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="road">Route</SelectItem>
                      <SelectItem value="sea">Maritime</SelectItem>
                      <SelectItem value="air">Aérien</SelectItem>
                      <SelectItem value="rail">Ferroviaire</SelectItem>
                      <SelectItem value="multimodal">Multimodal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="transitTime">Délai de transit (heures)</Label>
                  <Input id="transitTime" type="number" min="1" placeholder="24" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="distance">Distance (km)</Label>
                  <Input id="distance" type="number" min="0" placeholder="100" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit">Créer l'expédition</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewShipmentForm;
