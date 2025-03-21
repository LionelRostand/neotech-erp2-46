
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map, Car } from "lucide-react";

interface VehiclesStatusProps {
  availableVehicles: number;
  inUseVehicles: number;
  maintenanceVehicles: number;
  totalVehicles: number;
}

const VehiclesStatus: React.FC<VehiclesStatusProps> = ({ 
  availableVehicles, 
  inUseVehicles, 
  maintenanceVehicles, 
  totalVehicles 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            <span>Statut des véhicules</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Disponibles</p>
                  <p className="text-2xl font-bold text-green-600">{availableVehicles}</p>
                </div>
                <Car className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">En service</p>
                  <p className="text-2xl font-bold text-blue-600">{inUseVehicles}</p>
                </div>
                <Car className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Maintenance</p>
                  <p className="text-2xl font-bold text-orange-600">{maintenanceVehicles}</p>
                </div>
                <Car className="h-8 w-8 text-orange-500" />
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-purple-600">{totalVehicles}</p>
                </div>
                <Car className="h-8 w-8 text-purple-500" />
              </div>
            </div>
          </div>
          <button className="w-full mt-2 text-blue-600 text-sm font-medium hover:underline">
            Gérer la flotte
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehiclesStatus;
