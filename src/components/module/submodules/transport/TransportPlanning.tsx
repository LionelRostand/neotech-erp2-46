
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

const TransportPlanning = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Planning des Transports</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            <span>Vue Planning</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[400px]">
            <div className="text-center">
              <CalendarDays className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">Vue Planning</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                La visualisation du planning des transports sera implémentée dans la prochaine mise à jour.
                Vous pourrez y voir les disponibilités des véhicules, les périodes d'entretien et le suivi des locations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransportPlanning;
