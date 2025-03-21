
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart } from "lucide-react";

const TransportLoyalty = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Programme de Fidélité</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            <span>Récompenses et Offres</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[400px]">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Récompenses et Offres</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Le programme de fidélité sera implémenté dans la prochaine mise à jour.
                Vous pourrez y gérer les récompenses pour les clients réguliers, les offres spéciales et le suivi des points.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportLoyalty;
