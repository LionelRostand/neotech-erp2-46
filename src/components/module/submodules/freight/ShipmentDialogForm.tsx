
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useFreightClients } from '@/components/module/submodules/freight/hooks/useFreightClients';
import { ShipmentFormData, ShipmentLine } from '@/types/freight';
import { X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ShipmentDialogFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ShipmentFormData) => Promise<void>;
}

const ShipmentDialogForm: React.FC<ShipmentDialogFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = useState<"general" | "articles" | "pricing" | "tracking">("general");
  const [loading, setLoading] = useState(false);
  const { clients, isLoading: clientsLoading } = useFreightClients();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ShipmentFormData>({
    reference: '',
    origin: '',
    destination: '',
    customer: '',
    customerName: '',
    carrier: '',
    carrierName: '',
    shipmentType: 'export',
    status: 'draft',
    scheduledDate: '',
    estimatedDeliveryDate: '',
    lines: [],
    totalWeight: 0,
    notes: '',
  });

  const [formErrors, setFormErrors] = useState<{
    [key: string]: string;
  }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // If customer selection changes, update customer name
    if (name === 'customer') {
      const selectedClient = clients.find(client => client.id === value);
      if (selectedClient) {
        setFormData(prev => ({ 
          ...prev, 
          customer: value,
          customerName: selectedClient.name 
        }));
      }
    }
  };

  const handleAddLine = () => {
    const newLine: ShipmentLine = {
      id: `line-${Date.now()}`,
      productName: '',
      quantity: 1,
      weight: 0,
    };
    
    setFormData(prev => ({
      ...prev,
      lines: [...prev.lines, newLine]
    }));
  };

  const handleRemoveLine = (id: string) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.filter(line => line.id !== id)
    }));
  };

  const handleLineChange = (id: string, field: keyof ShipmentLine, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      lines: prev.lines.map(line => 
        line.id === id ? { ...line, [field]: value } : line
      )
    }));

    // Recalculate total weight
    calculateTotalWeight();
  };

  const calculateTotalWeight = () => {
    const totalWeight = formData.lines.reduce((sum, line) => sum + Number(line.weight), 0);
    setFormData(prev => ({ ...prev, totalWeight }));
  };

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    // General tab validation
    if (!formData.reference.trim()) {
      errors.reference = "La référence est requise";
    }
    
    if (!formData.origin.trim()) {
      errors.origin = "L'origine est requise";
    }
    
    if (!formData.destination.trim()) {
      errors.destination = "La destination est requise";
    }
    
    if (!formData.customer) {
      errors.customer = "Le client est requis";
    }
    
    if (!formData.scheduledDate) {
      errors.scheduledDate = "La date prévue est requise";
    }
    
    if (!formData.estimatedDeliveryDate) {
      errors.estimatedDeliveryDate = "La date de livraison estimée est requise";
    }
    
    // Lines validation (if on articles tab)
    if (activeTab === "articles" && formData.lines.length === 0) {
      errors.lines = "Ajoutez au moins un article";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Show error toast if validation fails
      toast.error("Veuillez corriger les erreurs du formulaire");
      
      // Switch to the tab with errors
      if (formErrors.reference || formErrors.origin || formErrors.destination || 
          formErrors.customer || formErrors.scheduledDate || formErrors.estimatedDeliveryDate) {
        setActiveTab("general");
      } else if (formErrors.lines) {
        setActiveTab("articles");
      }
      
      return;
    }
    
    try {
      setLoading(true);
      await onSubmit(formData);
      toast.success("Expédition créée avec succès");
      onOpenChange(false);
      // Navigate to shipments list
      navigate('/modules/freight/shipments');
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast.error("Erreur lors de la création de l'expédition");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nouvelle Expédition</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mt-4">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="general">Général</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="pricing">Tarification</TabsTrigger>
              <TabsTrigger value="tracking">Suivi & Route</TabsTrigger>
            </TabsList>
            
            {/* General Tab */}
            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reference">Référence</Label>
                  <Input 
                    id="reference" 
                    name="reference" 
                    value={formData.reference} 
                    onChange={handleInputChange}
                    className={formErrors.reference ? "border-red-500" : ""}
                  />
                  {formErrors.reference && <p className="text-red-500 text-xs">{formErrors.reference}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="shipmentType">Type d'expédition</Label>
                  <Select
                    value={formData.shipmentType}
                    onValueChange={(value) => handleSelectChange("shipmentType", value)}
                  >
                    <SelectTrigger>
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
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origine</Label>
                  <Input 
                    id="origin" 
                    name="origin" 
                    value={formData.origin} 
                    onChange={handleInputChange}
                    className={formErrors.origin ? "border-red-500" : ""}
                  />
                  {formErrors.origin && <p className="text-red-500 text-xs">{formErrors.origin}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input 
                    id="destination" 
                    name="destination" 
                    value={formData.destination} 
                    onChange={handleInputChange}
                    className={formErrors.destination ? "border-red-500" : ""}
                  />
                  {formErrors.destination && <p className="text-red-500 text-xs">{formErrors.destination}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer">Client</Label>
                <Select
                  value={formData.customer}
                  onValueChange={(value) => handleSelectChange("customer", value)}
                >
                  <SelectTrigger className={formErrors.customer ? "border-red-500" : ""}>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientsLoading ? (
                      <SelectItem value="loading">Chargement...</SelectItem>
                    ) : clients.length > 0 ? (
                      clients.map(client => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-clients">Aucun client trouvé</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {formErrors.customer && <p className="text-red-500 text-xs">{formErrors.customer}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Date prévue</Label>
                  <Input 
                    id="scheduledDate" 
                    name="scheduledDate" 
                    type="date"
                    value={formData.scheduledDate} 
                    onChange={handleInputChange}
                    className={formErrors.scheduledDate ? "border-red-500" : ""}
                  />
                  {formErrors.scheduledDate && <p className="text-red-500 text-xs">{formErrors.scheduledDate}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="estimatedDeliveryDate">Date de livraison estimée</Label>
                  <Input 
                    id="estimatedDeliveryDate" 
                    name="estimatedDeliveryDate" 
                    type="date"
                    value={formData.estimatedDeliveryDate} 
                    onChange={handleInputChange}
                    className={formErrors.estimatedDeliveryDate ? "border-red-500" : ""}
                  />
                  {formErrors.estimatedDeliveryDate && <p className="text-red-500 text-xs">{formErrors.estimatedDeliveryDate}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  value={formData.notes} 
                  onChange={handleInputChange}
                />
              </div>
            </TabsContent>
            
            {/* Articles Tab */}
            <TabsContent value="articles" className="space-y-4">
              <Button 
                type="button" 
                onClick={handleAddLine}
                variant="outline"
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un article
              </Button>
              
              {formErrors.lines && <p className="text-red-500 text-xs">{formErrors.lines}</p>}
              
              {formData.lines.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucun article ajouté. Cliquez sur "Ajouter un article" ci-dessus.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.lines.map((line, index) => (
                    <div key={line.id} className="border p-4 rounded-md relative">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() => handleRemoveLine(line.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`line-${index}-name`}>Nom du produit</Label>
                          <Input 
                            id={`line-${index}-name`}
                            value={line.productName} 
                            onChange={(e) => handleLineChange(line.id, 'productName', e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`line-${index}-quantity`}>Quantité</Label>
                          <Input 
                            id={`line-${index}-quantity`}
                            type="number"
                            min="1"
                            value={line.quantity} 
                            onChange={(e) => handleLineChange(line.id, 'quantity', parseInt(e.target.value))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`line-${index}-weight`}>Poids (kg)</Label>
                          <Input 
                            id={`line-${index}-weight`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.weight} 
                            onChange={(e) => handleLineChange(line.id, 'weight', parseFloat(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end">
                    <div className="font-medium">
                      Poids total: {formData.totalWeight} kg
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-md text-center">
                Cette section sera disponible dans une version future
              </div>
            </TabsContent>
            
            {/* Tracking Tab */}
            <TabsContent value="tracking" className="space-y-4">
              <div className="bg-gray-50 p-6 rounded-md text-center">
                Cette section sera disponible dans une version future
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création en cours..." : "Créer l'expédition"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentDialogForm;
