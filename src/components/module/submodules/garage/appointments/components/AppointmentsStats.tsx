
import React from 'react';
import { Card } from "@/components/ui/card";
import { Calendar } from 'lucide-react';

interface AppointmentsStatsProps {
  todayCount: number;
  activeCount: number;
  pendingCount: number;
  totalCount: number;
}

const AppointmentsStats = ({ todayCount, activeCount, pendingCount, totalCount }: AppointmentsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{todayCount}</div>
              <p className="text-sm text-gray-600">Rendez-vous du jour</p>
              <p className="text-xs text-gray-500">Planifiés aujourd'hui</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-green-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-sm text-gray-600">En cours</p>
              <p className="text-xs text-gray-500">Rendez-vous confirmés</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-yellow-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-8 w-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold">{pendingCount}</div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-xs text-gray-500">À confirmer</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-purple-50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-sm text-gray-600">Total rendez-vous</p>
              <p className="text-xs text-gray-500">Tous les rendez-vous</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AppointmentsStats;
