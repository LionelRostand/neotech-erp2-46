
import React, { useState } from 'react';
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { ShipmentLine } from '@/types/freight';
import { useNavigate } from 'react-router-dom';

interface ShipmentData {
  reference: string;
  customer: string;
  shipmentType: string;
  origin: string;
  destination: string;
  carrier: string;
  scheduledDate: string;
  estimatedDelivery: string;
  status: string;
  totalWeight: number;
  totalPrice: number;
  trackingCode: string;
  notes?: string;
  shipmentLines: ShipmentLine[];
}

interface FirebaseShipmentFormProps {
  shipmentData: ShipmentData;
  onSuccess?: () => void;
}

const FirebaseShipmentForm: React.FC<FirebaseShipmentFormProps> = ({ 
  shipmentData, 
  onSuccess 
}) => {
  const { add, loading, error } = useFirestore(COLLECTIONS.FREIGHT.SHIPMENTS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Créer un document pour l'expédition
      const result = await add({
        ...shipmentData,
        createdBy: "user_id", // Remplacer par l'ID de l'utilisateur authentifié
        createdAt: new Date()
      });
      
      toast({
        title: "Expédition créée",
        description: `L'expédition a été enregistrée avec succès. Référence: ${shipmentData.reference}`,
      });
      
      // Créer un document pour le suivi
      const trackingFirestore = useFirestore(COLLECTIONS.FREIGHT.TRACKING);
      await trackingFirestore.add({
        shipmentId: result.id,
        trackingCode: shipmentData.trackingCode,
        status: 'pending',
        statusHistory: [
          {
            status: 'pending',
            location: shipmentData.origin,
            timestamp: new Date(),
            note: 'Expédition créée'
          }
        ],
        currentLocation: shipmentData.origin,
        origin: shipmentData.origin,
        destination: shipmentData.destination,
        estimatedDelivery: shipmentData.estimatedDelivery
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
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md mb-4">
          Erreur: {error}
        </div>
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
