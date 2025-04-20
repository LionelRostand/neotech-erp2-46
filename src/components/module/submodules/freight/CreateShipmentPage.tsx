
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
import CreateClientDialog from './clients/CreateClientDialog';

// Define a proper interface for the shipment data
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

// Create initial default values for the shipment data
const defaultShipmentData: ShipmentData = {
  reference: '',
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
  lines: []
};

interface FirebaseShipmentFormProps {
  shipmentData?: Partial<ShipmentData>;
  onSuccess?: () => void;
}

const FirebaseShipmentForm: React.FC<FirebaseShipmentFormProps> = ({ 
  shipmentData = defaultShipmentData, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateClientDialogOpen, setIsCreateClientDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(shipmentData.customer || '');
  const navigate = useNavigate();
  const { clients, isLoading: isLoadingClients, refetchClients } = useFreightClients();

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      toast.error("Veuillez sélectionner un client");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Ensure we're using the selected customer value
      const completeShipmentData = {
        ...shipmentData,
        customer: selectedCustomer
      };

      await createShipment({
        reference: completeShipmentData.reference || `EXP-${Date.now().toString().slice(-6)}`,
        origin: completeShipmentData.origin || '',
        destination: completeShipmentData.destination || '',
        customer: completeShipmentData.customer,
        carrier: completeShipmentData.carrier || '',
        carrierName: completeShipmentData.carrierName || '',
        shipmentType: (completeShipmentData.shipmentType || 'export') as 'import' | 'export' | 'local' | 'international',
        status: (completeShipmentData.status || 'draft') as 'draft' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'delayed',
        trackingNumber: completeShipmentData.trackingNumber,
        scheduledDate: completeShipmentData.scheduledDate || new Date().toISOString().split('T')[0],
        estimatedDeliveryDate: completeShipmentData.estimatedDeliveryDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        lines: completeShipmentData.lines || [],
        totalWeight: completeShipmentData.totalWeight || 0,
        notes: completeShipmentData.notes
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        toast.success(`Expédition créée avec succès`);
        navigate('/modules/freight/shipments');
      }
    } catch (error) {
      console.error('Error creating shipment:', error);
      toast.error("Une erreur est survenue lors de la création de l'expédition.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClientCreated = () => {
    setIsCreateClientDialogOpen(false);
    refetchClients();
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Select 
            value={selectedCustomer} 
            onValueChange={setSelectedCustomer}
          >
            <SelectTrigger>
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
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => setIsCreateClientDialogOpen(true)} 
          title="Ajouter un client"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedCustomer}
        className="w-full"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enregistrer sur Firebase
      </Button>

      <CreateClientDialog 
        open={isCreateClientDialogOpen}
        onOpenChange={setIsCreateClientDialogOpen}
        onSuccess={handleClientCreated}
      />
    </div>
  );
};

const CreateShipmentPage = () => {
  // Initialize with default values
  const initialData = {
    ...defaultShipmentData,
    reference: `EXP-${Date.now().toString().slice(-6)}`
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Nouvelle Expédition</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Shipment form fields would go here */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Informations de base</h2>
            <p className="text-gray-500 mb-6">Remplissez les informations de la nouvelle expédition.</p>
            
            {/* Form fields would be implemented here */}
            <div className="text-center text-gray-500 py-10">
              Implémentation du formulaire à venir
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Enregistrer</h2>
            <FirebaseShipmentForm shipmentData={initialData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateShipmentPage;
