
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";

const FleetManagementCard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          <span>Gestion de la Flotte</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Gestion de la Flotte</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto">
              La gestion de la flotte de véhicules sera implémentée dans la prochaine mise à jour.
              Vous pourrez y ajouter des véhicules, suivre leur état et consulter l'historique des utilisations.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FleetManagementCard;
