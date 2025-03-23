
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ShipmentLine } from '@/types/freight';
import { useNavigate } from 'react-router-dom';
import { createShipment } from './services/shipmentService';

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
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Utiliser notre nouveau service pour créer l'expédition
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
      
      // Si un callback de succès est fourni, l'appeler
      if (onSuccess) {
        onSuccess();
      } else {
        // Sinon, rediriger vers la liste des expéditions
        navigate('/modules/freight/shipments');
      }
    } catch (err) {
      console.error('Erreur lors de la création de l\'expédition:', err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'expédition.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
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
