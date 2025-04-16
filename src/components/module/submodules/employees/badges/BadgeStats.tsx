
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { BadgeData } from './BadgeTypes';
import { CheckCircle, AlertCircle, Clock, Users } from 'lucide-react';

interface BadgeStatsProps {
  badgesList: BadgeData[];
  employeesCount: number;
}

const BadgeStats: React.FC<BadgeStatsProps> = ({ badgesList, employeesCount }) => {
  // Count badges by status
  const pendingBadges = badgesList.filter(badge => badge.status === 'pending').length;
  const errorBadges = badgesList.filter(badge => badge.status === 'error').length;
  // Fix: changed 'danger' to 'error' since 'danger' is not in the BadgeData status types
  const validBadges = badgesList.filter(badge => badge.status === 'success').length;
  const warningBadges = badgesList.filter(badge => badge.status === 'warning').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Total badges actifs</p>
              <h3 className="text-2xl font-bold mt-1">{validBadges}</h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Badges en attente</p>
              <h3 className="text-2xl font-bold mt-1">{pendingBadges}</h3>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Badges avec alerte</p>
              <h3 className="text-2xl font-bold mt-1">{errorBadges + warningBadges}</h3>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-500">Employés sans badge</p>
              <h3 className="text-2xl font-bold mt-1">{Math.max(0, employeesCount - badgesList.length)}</h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeStats;
