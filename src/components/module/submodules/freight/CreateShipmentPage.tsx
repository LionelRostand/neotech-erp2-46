
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Plus } from 'lucide-react';
import { ShipmentLine } from '@/types/freight';
import { useNavigate } from 'react-router-dom';
import { createShipment } from './services/shipmentService';
import { toast } from 'sonner';
import { useFreightClients } from './hooks/useFreightClients';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ShipmentData {
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
  totalPrice?: number;
  trackingNumber?: string;
  notes?: string;
  lines: ShipmentLine[];
}

const CreateShipmentPage: React.FC = () => {
  // Initialize with default shipment data
  const [shipmentData, setShipmentData] = useState<ShipmentData>({
    reference: `SHP-${Date.now().toString().slice(-6)}`,
    customer: '',
    shipmentType: 'local',
    origin: '',
    destination: '',
    carrier: '',
    carrierName: '',
    scheduledDate: new Date().toISOString().split('T')[0],
    estimatedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    totalWeight: 0,
    lines: []
  });

  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/modules/freight/shipments');
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Créer une nouvelle expédition</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l'expédition</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Form fields would go here */}
              <p className="text-gray-500">
                Complétez les détails de l'expédition avant de l'enregistrer.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Enregistrer l'expédition</CardTitle>
            </CardHeader>
            <CardContent>
              <FirebaseShipmentForm 
                shipmentData={shipmentData} 
                onSuccess={handleSuccess}
                onUpdateShipmentData={setShipmentData}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

interface FirebaseShipmentFormProps {
  shipmentData: ShipmentData;
  onSuccess?: () => void;
  onUpdateShipmentData: (data: ShipmentData) => void;
}

const FirebaseShipmentForm: React.FC<FirebaseShipmentFormProps> = ({ 
  shipmentData, 
  onSuccess,
  onUpdateShipmentData
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { clients, isLoading: isLoadingClients } = useFreightClients();

  const handleSubmit = async () => {
    if (!shipmentData.customer) {
      toast.error("Veuillez sélectionner un client");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting shipment data:', shipmentData);
      await createShipment({
        reference: shipmentData.reference,
        origin: shipmentData.origin,
        destination: shipmentData.destination,
        customer: shipmentData.customer,
        carrier: shipmentData.carrier,
        carrierName: shipmentData.carrierName,
        shipmentType: shipmentData.shipmentType as 'import' | 'export' | 'local' | 'international',
        status: shipmentData.status as 'draft' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'delayed',
        trackingNumber: shipmentData.trackingNumber,
        scheduledDate: shipmentData.scheduledDate,
        estimatedDeliveryDate: shipmentData.estimatedDeliveryDate,
        lines: shipmentData.lines,
        totalWeight: shipmentData.totalWeight,
        notes: shipmentData.notes
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        toast.success(`Expédition ${shipmentData.reference} créée avec succès`);
        navigate('/modules/freight/shipments');
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error("Une erreur est survenue lors de la création de l'expédition.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientChange = (value: string) => {
    const updatedData = { ...shipmentData, customer: value };
    onUpdateShipmentData(updatedData);
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Select 
            value={shipmentData.customer} 
            onValueChange={handleClientChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.id}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button 
        variant="outline"
        onClick={() => navigate('/modules/freight/clients')}
        size="sm"
        className="w-full mb-2"
      >
        <Plus className="mr-2 h-4 w-4" />
        Nouveau client
      </Button>

      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || !shipmentData.customer}
        className="w-full"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enregistrer l'expédition
      </Button>
    </div>
  );
};

export default CreateShipmentPage;
