
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { ShipmentFormData } from '@/types/freight';
import ShipmentDialogForm from './ShipmentDialogForm';

const CreateShipmentPage: React.FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateShipment = async (shipmentData: ShipmentFormData) => {
    try {
      // Add creation timestamp and id
      const shipmentWithMeta = {
        ...shipmentData,
        createdAt: new Date().toISOString(),
        id: `shipment-${Date.now()}`,
        status: shipmentData.status || 'draft',
      };

      // Save to Firestore
      await addDoc(collection(db, COLLECTIONS.FREIGHT.SHIPMENTS), shipmentWithMeta);
      
      toast.success("Expédition créée avec succès");
      return shipmentWithMeta;
    } catch (error) {
      console.error("Error creating shipment:", error);
      toast.error("Erreur lors de la création de l'expédition");
      throw error;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Créer une expédition</h1>
        <Button onClick={() => setIsDialogOpen(true)} className="flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Expédition
        </Button>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Créez une nouvelle expédition</h2>
        <p className="text-gray-600 mb-6">
          Cliquez sur le bouton "Nouvelle Expédition" ci-dessus pour commencer.
        </p>
      </div>

      <ShipmentDialogForm 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleCreateShipment}
      />
    </div>
  );
};

export default CreateShipmentPage;
