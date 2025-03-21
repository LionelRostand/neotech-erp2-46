
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";

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
  const availablePercentage = Math.round(100 * availableVehicles / totalVehicles);
  const inUsePercentage = Math.round(100 * inUseVehicles / totalVehicles);
  const maintenancePercentage = Math.round(100 * maintenanceVehicles / totalVehicles);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            <span>Statut de la flotte</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Disponibles</p>
              <p className="text-2xl font-bold text-green-600">{availableVehicles}</p>
              <p className="text-xs text-gray-500">{availablePercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">En service</p>
              <p className="text-2xl font-bold text-blue-600">{inUseVehicles}</p>
              <p className="text-xs text-gray-500">{inUsePercentage}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Maintenance</p>
              <p className="text-2xl font-bold text-orange-600">{maintenanceVehicles}</p>
              <p className="text-xs text-gray-500">{maintenancePercentage}%</p>
            </div>
          </div>
          
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div 
              className="h-full bg-green-500 float-left rounded-l-full" 
              style={{ width: `${availablePercentage}%` }} 
            />
            <div 
              className="h-full bg-blue-500 float-left" 
              style={{ width: `${inUsePercentage}%` }} 
            />
            <div 
              className="h-full bg-orange-500 float-left rounded-r-full" 
              style={{ width: `${maintenancePercentage}%` }} 
            />
          </div>
          
          <div className="text-sm text-gray-500 mt-4">
            <div className="font-medium">Prochains retours:</div>
            <p className="mt-2">• Mercedes Classe E (AB-123-CD) - <span className="font-medium">Aujourd'hui 18:00</span></p>
            <p>• BMW Série 5 (EF-456-GH) - <span className="font-medium">Demain 10:30</span></p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehiclesStatus;
