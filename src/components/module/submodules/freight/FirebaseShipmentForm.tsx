
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { ShipmentLine } from '@/types/freight';
import { useNavigate } from 'react-router-dom';
import { createShipment } from './services/shipmentService';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ShipmentData {
  reference: string;
  customer: string;
  customerName?: string;
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
  pricing?: {
    basePrice: number;
    geoZone: string;
    shipmentKind: string;
    distance: number;
    extraFees: number;
  };
  trackingNumber?: string;
  notes?: string;
  routeId?: string;
  lines: ShipmentLine[];
  actualDeliveryDate?: string;
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
  const [validationError, setValidationError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!shipmentData.origin || !shipmentData.destination) {
      setValidationError("Les champs origine et destination sont obligatoires");
      toast.error("Les champs origine et destination sont obligatoires");
      return;
    }
    
    setValidationError(null);
    setIsSubmitting(true);
    
    try {
      console.log('Submitting shipment data:', shipmentData);

      // Ajout : passage de TOUS les champs du wizard au service, y compris pricing, totalPrice, etc.
      await createShipment({
        reference: shipmentData.reference,
        origin: shipmentData.origin,
        destination: shipmentData.destination,
        customer: shipmentData.customer,
        customerName: shipmentData.customerName,
        carrier: shipmentData.carrier,
        carrierName: shipmentData.carrierName,
        shipmentType: shipmentData.shipmentType as 'import' | 'export' | 'local' | 'international',
        status: shipmentData.status as 'draft' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'delayed',
        trackingNumber: shipmentData.trackingNumber,
        scheduledDate: shipmentData.scheduledDate,
        estimatedDeliveryDate: shipmentData.estimatedDeliveryDate,
        actualDeliveryDate: shipmentData.actualDeliveryDate,
        routeId: shipmentData.routeId,
        lines: shipmentData.lines,
        totalWeight: shipmentData.totalWeight,
        notes: shipmentData.notes,
        totalPrice: shipmentData.totalPrice,
        pricing: shipmentData.pricing
      });
      
      if (onSuccess) {
        onSuccess();
      } else {
        toast.success(`Expédition ${shipmentData.reference} créée avec succès`);
        navigate('/modules/freight/shipments');
      }
    } catch (err) {
      console.error('Error creating shipment:', err);
      setValidationError(err instanceof Error ? err.message : "Une erreur est survenue lors de la création de l'expédition.");
      toast.error(err instanceof Error ? err.message : "Une erreur est survenue lors de la création de l'expédition.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      {validationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Enregistrer sur Firebase
      </Button>
    </div>
  );
};

export default FirebaseShipmentForm;
