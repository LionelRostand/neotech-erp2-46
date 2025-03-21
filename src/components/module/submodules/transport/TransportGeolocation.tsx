
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

const TransportGeolocation = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Géolocalisation des Véhicules</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            <span>Suivi en Temps Réel</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[400px]">
            <div className="text-center">
              <Map className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Suivi en Temps Réel</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                La géolocalisation des véhicules sera implémentée dans la prochaine mise à jour.
                Vous pourrez y suivre en temps réel les véhicules, recevoir des alertes et optimiser les trajets.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportGeolocation;
