
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Clock, PackageSearch, Settings } from 'lucide-react';

interface RepairsStatsProps {
  todayCount: number;
  activeCount: number;
  pendingPartsCount: number;
  totalCount: number;
}

const RepairsStats = ({ todayCount, activeCount, pendingPartsCount, totalCount }: RepairsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Wrench className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{todayCount}</div>
              <p className="text-sm text-gray-600">Réparations aujourd'hui</p>
              <p className="text-xs text-gray-500">Planifiées pour aujourd'hui</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-xs text-gray-500">Réparations actives</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <PackageSearch className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{pendingPartsCount}</div>
              <p className="text-sm text-gray-600">En attente de pièces</p>
              <p className="text-xs text-gray-500">Commandes en attente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Settings className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-sm text-gray-600">Total réparations</p>
              <p className="text-xs text-gray-500">Toutes les réparations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepairsStats;
