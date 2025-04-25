
import React from 'react';
import { Card } from "@/components/ui/card";
import { UserCog } from 'lucide-react';

interface MechanicsStatsProps {
  availableCount: number;
  busyCount: number;
  onBreakCount: number;
  totalCount: number;
}

const MechanicsStats = ({ availableCount, busyCount, onBreakCount, totalCount }: MechanicsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <UserCog className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{availableCount}</div>
              <p className="text-sm text-gray-600">Disponibles</p>
              <p className="text-xs text-gray-500">Mécaniciens disponibles</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-green-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <UserCog className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{busyCount}</div>
              <p className="text-sm text-gray-600">En service</p>
              <p className="text-xs text-gray-500">Mécaniciens occupés</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-yellow-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <UserCog className="h-8 w-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold">{onBreakCount}</div>
              <p className="text-sm text-gray-600">En pause</p>
              <p className="text-xs text-gray-500">Mécaniciens en pause</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-purple-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <UserCog className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-sm text-gray-600">Total mécaniciens</p>
              <p className="text-xs text-gray-500">Tous les mécaniciens</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MechanicsStats;
