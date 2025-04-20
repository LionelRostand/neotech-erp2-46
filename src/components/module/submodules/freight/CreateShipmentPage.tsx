
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ShipmentLine } from '@/types/freight';
import FirebaseShipmentForm from './FirebaseShipmentForm';
import { useQuery } from '@tanstack/react-query';
import { fetchFreightCollectionData } from '@/hooks/fetchFreightCollectionData';

interface ShipmentFormData {
  reference: string;
  customer: string;
  shipmentType: string;
  origin: string;
  destination: string;
  carrier: string;
  carrierName: string;
  scheduledDate: string;
  estimatedDeliveryDate: string;
  status: string;
  totalWeight: number;
  trackingNumber?: string;
  notes?: string;
  lines: ShipmentLine[];
}

const initialFormState: ShipmentFormData = {
  reference: `EXP-${new Date().getTime().toString().substring(5)}`,
  customer: '',
  shipmentType: 'export',
  origin: '',
  destination: '',
  carrier: '',
  carrierName: '',
  scheduledDate: new Date().toISOString().split('T')[0],
  estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: 'draft',
  totalWeight: 0,
  trackingNumber: '',
  notes: '',
  lines: []
};

const CreateShipmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ShipmentFormData>(initialFormState);
  const [shipmentLines, setShipmentLines] = useState<ShipmentLine[]>([
    {
      id: Date.now().toString(),
      productName: '',
      quantity: 1,
      weight: 0
    }
  ]);

  // Fetch carriers for dropdown
  const { data: carriers = [] } = useQuery({
    queryKey: ['freight', 'carriers'],
    queryFn: () => fetchFreightCollectionData('CARRIERS')
  });

  // Fetch customers for dropdown
  const { data: customers = [] } = useQuery({
    queryKey: ['freight', 'customers'],
    queryFn: () => fetchFreightCollectionData('CUSTOMERS')
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // If carrier is selected, set carrier name
    if (name === 'carrier') {
      const selectedCarrier = carriers.find(c => c.id === value);
      if (selectedCarrier) {
        setFormData(prev => ({ ...prev, carrierName: selectedCarrier.name }));
      }
    }
  };

  const handleAddLine = () => {
    const newLine: ShipmentLine = {
      id: Date.now().toString(),
      productName: '',
      quantity: 1,
      weight: 0
    };
    setShipmentLines(prev => [...prev, newLine]);
  };

  const handleLineChange = (id: string, field: keyof ShipmentLine, value: any) => {
    setShipmentLines(prev => prev.map(line => 
      line.id === id ? { ...line, [field]: value } : line
    ));
  };

  const handleRemoveLine = (id: string) => {
    setShipmentLines(prev => prev.filter(line => line.id !== id));
  };

  // Calculate total weight
  const totalWeight = shipmentLines.reduce((total, line) => total + (line.weight * line.quantity), 0);

  const handleBack = () => {
    navigate('/modules/freight/shipments');
  };

  const prepareFormDataForSubmission = (): ShipmentFormData => {
    return {
      ...formData,
      lines: shipmentLines,
      totalWeight
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="outline" onClick={handleBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h1 className="text-2xl font-bold">Créer une nouvelle expédition</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations de l'expédition</CardTitle>
          <CardDescription>
            Renseignez les détails de la nouvelle expédition
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="reference">Référence</Label>
                <Input
                  id="reference"
                  name="reference"
                  value={formData.reference}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="customer">Client</Label>
                <Select 
                  value={formData.customer} 
                  onValueChange={(value) => handleSelectChange('customer', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="shipmentType">Type d'expédition</Label>
                <Select 
                  value={formData.shipmentType} 
                  onValueChange={(value) => handleSelectChange('shipmentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="import">Import</SelectItem>
                    <SelectItem value="export">Export</SelectItem>
                    <SelectItem value="local">National</SelectItem>
                    <SelectItem value="international">International</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="origin">Origine</Label>
                <Input
                  id="origin"
                  name="origin"
                  value={formData.origin}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  name="destination"
                  value={formData.destination}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="carrier">Transporteur</Label>
                <Select 
                  value={formData.carrier} 
                  onValueChange={(value) => handleSelectChange('carrier', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un transporteur" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((carrier: any) => (
                      <SelectItem key={carrier.id} value={carrier.id}>
                        {carrier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="status">Statut</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger>
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
              
              <div>
                <Label htmlFor="scheduledDate">Date prévue</Label>
                <Input
                  id="scheduledDate"
                  name="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="estimatedDeliveryDate">Date de livraison estimée</Label>
                <Input
                  id="estimatedDeliveryDate"
                  name="estimatedDeliveryDate"
                  type="date"
                  value={formData.estimatedDeliveryDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="trackingNumber">Numéro de suivi</Label>
                <Input
                  id="trackingNumber"
                  name="trackingNumber"
                  value={formData.trackingNumber || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Lignes d'expédition</h3>
              <Button type="button" variant="outline" onClick={handleAddLine}>
                Ajouter une ligne
              </Button>
            </div>
            
            {shipmentLines.map((line, index) => (
              <div key={line.id} className="grid grid-cols-12 gap-4 mb-4 items-end">
                <div className="col-span-5">
                  <Label htmlFor={`product-${line.id}`}>Produit</Label>
                  <Input
                    id={`product-${line.id}`}
                    value={line.productName}
                    onChange={(e) => handleLineChange(line.id, 'productName', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor={`quantity-${line.id}`}>Quantité</Label>
                  <Input
                    id={`quantity-${line.id}`}
                    type="number"
                    value={line.quantity}
                    onChange={(e) => handleLineChange(line.id, 'quantity', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-3">
                  <Label htmlFor={`weight-${line.id}`}>Poids (kg)</Label>
                  <Input
                    id={`weight-${line.id}`}
                    type="number"
                    value={line.weight}
                    onChange={(e) => handleLineChange(line.id, 'weight', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-2">
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={() => handleRemoveLine(line.id)}
                    disabled={shipmentLines.length === 1}
                    className="w-full"
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="mt-4 text-right">
              <p className="font-semibold">Poids total: {totalWeight} kg</p>
            </div>
          </div>
          
          <FirebaseShipmentForm shipmentData={prepareFormDataForSubmission()} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateShipmentPage;
