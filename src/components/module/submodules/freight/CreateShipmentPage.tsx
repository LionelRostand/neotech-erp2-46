
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

interface FirebaseShipmentFormProps {
  shipmentData: ShipmentData;
  onSuccess?: () => void;
}

const FirebaseShipmentForm: React.FC<FirebaseShipmentFormProps> = ({ 
  shipmentData, 
  onSuccess 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateClientDialogOpen, setIsCreateClientDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { clients, isLoading: isLoadingClients, refetchClients } = useFreightClients();

  const handleSubmit = async () => {
    if (!shipmentData.customer) {
      toast.error("Veuillez sélectionner un client");
      return;
    }

    setIsSubmitting(true);
    
    try {
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

  const handleClientCreated = () => {
    setIsCreateClientDialogOpen(false);
    refetchClients();
  };

  return (
    <div className="grid gap-4">
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Select 
            value={shipmentData.customer} 
            onValueChange={(value) => {
              shipmentData.customer = value;
            }}
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
        disabled={isSubmitting || !shipmentData.customer}
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

export default FirebaseShipmentForm;
