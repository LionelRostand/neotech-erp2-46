
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ShipmentWizardDialog from './ShipmentWizardDialog';

const FreightShipmentsPage: React.FC = () => {
  const [showDialog, setShowDialog] = useState(false);

  // Ce sera une future liste des expéditions (ici vide pour l'instant)
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Expéditions</h1>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          onClick={() => setShowDialog(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Expédition
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-md p-8">
        <div>
          <div className="flex space-x-4 mb-3">
            <Button variant="outline" className="px-4">Toutes</Button>
            <Button variant="outline" className="px-4">En cours</Button>
            <Button variant="outline" className="px-4">Livrées</Button>
            <Button variant="outline" className="px-4">Retardées</Button>
          </div>
          <div className="border rounded-md px-6 py-10 text-center text-muted-foreground text-lg">
            <p>Liste des Expéditions</p>
            <span className="block text-sm text-muted-foreground mt-1">
              Consultez et gérez toutes vos expéditions
            </span>
            <p className="mt-6 text-gray-400">Aucune expédition trouvée</p>
          </div>
        </div>
      </div>
      <ShipmentWizardDialog open={showDialog} onOpenChange={setShowDialog} />
    </div>
  );
};

export default FreightShipmentsPage;
