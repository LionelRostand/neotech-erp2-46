
import React from 'react';
import { Card } from "@/components/ui/card";
import { Car, Settings, AlertTriangle } from "lucide-react";
import { Vehicle } from '@/components/module/submodules/garage/types/garage-types';

interface VehicleStatsCardsProps {
  vehicles: Vehicle[];
}

const VehicleStatsCards: React.FC<VehicleStatsCardsProps> = ({ vehicles }) => {
  const stats = {
    total: vehicles.length,
    active: vehicles.filter(v => v.status === 'active').length,
    maintenance: vehicles.filter(v => v.status === 'maintenance').length,
    needsMaintenance: vehicles.filter(v => {
      if (!v.lastService || !v.nextService) return false;
      return new Date(v.nextService) <= new Date();
    }).length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 flex items-center space-x-4 bg-blue-50">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Car className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-blue-600">Total Véhicules</p>
          <h3 className="text-2xl font-bold">{stats.total}</h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center space-x-4 bg-green-50">
        <div className="p-3 bg-green-100 rounded-lg">
          <Settings className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-green-600">Véhicules Actifs</p>
          <h3 className="text-2xl font-bold">{stats.active}</h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center space-x-4 bg-orange-50">
        <div className="p-3 bg-orange-100 rounded-lg">
          <Settings className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-orange-600">En Maintenance</p>
          <h3 className="text-2xl font-bold">{stats.maintenance}</h3>
        </div>
      </Card>

      <Card className="p-6 flex items-center space-x-4 bg-red-50">
        <div className="p-3 bg-red-100 rounded-lg">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-red-600">Maintenance Requise</p>
          <h3 className="text-2xl font-bold">{stats.needsMaintenance}</h3>
        </div>
      </Card>
    </div>
  );
};

export default VehicleStatsCards;
