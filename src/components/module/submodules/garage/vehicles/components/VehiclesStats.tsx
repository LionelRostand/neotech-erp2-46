
import React from 'react';
import { Card } from "@/components/ui/card";
import { Car } from 'lucide-react';

interface VehiclesStatsProps {
  todayCount: number;
  activeCount: number;
  maintenanceCount: number;
  totalCount: number;
}

const VehiclesStats = ({ todayCount, activeCount, maintenanceCount, totalCount }: VehiclesStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Car className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{todayCount}</div>
              <p className="text-sm text-gray-600">Véhicules du jour</p>
              <p className="text-xs text-gray-500">Ajoutés aujourd'hui</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-green-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Car className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-sm text-gray-600">Véhicules actifs</p>
              <p className="text-xs text-gray-500">En bon état</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-yellow-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Car className="h-8 w-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold">{maintenanceCount}</div>
              <p className="text-sm text-gray-600">En maintenance</p>
              <p className="text-xs text-gray-500">En réparation</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-purple-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Car className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-sm text-gray-600">Total véhicules</p>
              <p className="text-xs text-gray-500">Dans la base de données</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VehiclesStats;
