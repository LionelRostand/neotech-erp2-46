import React, { useState, useEffect } from 'react';
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
import { ShipmentLine } from '@/types/freight';
import ShipmentLinesForm from './ShipmentLinesForm';
import ShipmentPriceCalculator from './ShipmentPriceCalculator';
import { mockCarriers, mockRoutes } from './mockData';
import { Printer, FileText, MapPin } from 'lucide-react';

interface NewShipmentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewShipmentForm: React.FC<NewShipmentFormProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [shipmentLines, setShipmentLines] = useState<ShipmentLine[]>([]);
  const [totalWeight, setTotalWeight] = useState(0);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [trackingCode, setTrackingCode] = useState('');
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [showDeliveryNotePreview, setShowDeliveryNotePreview] = useState(false);
  
  useEffect(() => {
    const generateTrackingCode = () => {
      const prefix = 'TRK';
      const randomPart = Math.floor(10000000 + Math.random() * 90000000).toString();
      return `${prefix}${randomPart}`;
    };
    
    setTrackingCode(generateTrackingCode());
  }, []);
  
  useEffect(() => {
    if (shipmentLines && shipmentLines.length > 0) {
      const weight = shipmentLines.reduce((sum, line) => sum + (line.weight * line.quantity), 0);
      setTotalWeight(weight);
    } else {
      setTotalWeight(0);
    }
  }, [shipmentLines]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Expédition créée",
      description: `L'expédition a été créée avec succès. Coût: ${calculatedPrice.toFixed(2)}€, Code de suivi: ${trackingCode}`,
    });
    
    onClose();
  };

  const handleGenerateInvoice = () => {
    setShowInvoicePreview(true);
  };

  const handleGenerateDeliveryNote = () => {
    setShowDeliveryNotePreview(true);
  };

  const handleUpdateShipmentLines = (updatedLines: ShipmentLine[]) => {
    setShipmentLines(updatedLines);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Nouvelle Expédition</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Informations générales</TabsTrigger>
              <TabsTrigger value="items">Articles</TabsTrigger>
              <TabsTrigger value="pricing">Tarification</TabsTrigger>
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
              <ShipmentLinesForm onLinesUpdate={handleUpdateShipmentLines} />
            </TabsContent>
            
            <TabsContent value="pricing" className="mt-4">
              <ShipmentPriceCalculator 
                totalWeight={totalWeight} 
                shipmentLines={shipmentLines}
                onPriceCalculated={setCalculatedPrice}
              />
              
              <div className="mt-6 flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Documents</h3>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerateInvoice}
                      disabled={calculatedPrice <= 0}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Générer la facture
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGenerateDeliveryNote}
                      disabled={calculatedPrice <= 0}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Générer le bon de livraison
                    </Button>
                  </div>
                </div>
                
                <div className="text-right">
                  <h3 className="text-lg font-semibold mb-2">
                    Prix total: {calculatedPrice.toFixed(2)} €
                  </h3>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tracking" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trackingNumber">Numéro de suivi</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="trackingNumber" 
                      value={trackingCode}
                      readOnly
                    />
                    <Button 
                      variant="ghost"
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(trackingCode);
                        toast({ 
                          title: "Copié!", 
                          description: "Code de suivi copié dans le presse-papier."
                        });
                      }}
                    >
                      Copier
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Ce code permettra de suivre l'expédition en temps réel.
                  </p>
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
              
              <div className="mt-4 bg-slate-50 p-4 rounded-md border">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium">Suivi en temps réel</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Un lien de suivi sera généré automatiquement après la création de l'expédition.
                  Les clients pourront accéder au suivi en temps réel via le code de suivi.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-2">
              {activeTab !== "general" && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    const tabs = ["general", "items", "pricing", "tracking"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1]);
                    }
                  }}
                >
                  Précédent
                </Button>
              )}
              
              {activeTab !== "tracking" && (
                <Button 
                  type="button"
                  onClick={() => {
                    const tabs = ["general", "items", "pricing", "tracking"];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1]);
                    }
                  }}
                >
                  Suivant
                </Button>
              )}
            </div>
            
            <DialogFooter className="mt-0">
              <DialogClose asChild>
                <Button type="button" variant="outline">Annuler</Button>
              </DialogClose>
              {activeTab === "tracking" && (
                <Button type="submit">Créer l'expédition</Button>
              )}
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
      
      {showInvoicePreview && (
        <DocumentPreview 
          type="invoice" 
          isOpen={showInvoicePreview} 
          onClose={() => setShowInvoicePreview(false)}
          shipmentLines={shipmentLines}
          totalPrice={calculatedPrice}
          trackingCode={trackingCode}
        />
      )}
      
      {showDeliveryNotePreview && (
        <DocumentPreview 
          type="delivery" 
          isOpen={showDeliveryNotePreview} 
          onClose={() => setShowDeliveryNotePreview(false)}
          shipmentLines={shipmentLines}
          totalPrice={calculatedPrice}
          trackingCode={trackingCode}
        />
      )}
    </Dialog>
  );
};

export default NewShipmentForm;
