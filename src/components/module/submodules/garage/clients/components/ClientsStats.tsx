
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, UserPlus, UserMinus, User } from 'lucide-react';

interface ClientsStatsProps {
  todayCount: number;
  activeCount: number;
  inactiveCount: number;
  totalCount: number;
}

const ClientsStats = ({ todayCount, activeCount, inactiveCount, totalCount }: ClientsStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <UserPlus className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{todayCount}</div>
              <p className="text-sm text-gray-600">Nouveaux clients</p>
              <p className="text-xs text-gray-500">Ajoutés aujourd'hui</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{activeCount}</div>
              <p className="text-sm text-gray-600">Clients actifs</p>
              <p className="text-xs text-gray-500">En relations actives</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <UserMinus className="h-8 w-8 text-yellow-600" />
            <div>
              <div className="text-2xl font-bold">{inactiveCount}</div>
              <p className="text-sm text-gray-600">Clients inactifs</p>
              <p className="text-xs text-gray-500">Sans activité récente</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-purple-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <User className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{totalCount}</div>
              <p className="text-sm text-gray-600">Total clients</p>
              <p className="text-xs text-gray-500">Base de données clients</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsStats;
