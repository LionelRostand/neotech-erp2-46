
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BadgeCheck, AlertCircle, BadgeAlert, Users } from 'lucide-react';
import { BadgeData } from './BadgeTypes';

interface BadgeStatsProps {
  badgesList: BadgeData[];
  employeesCount: number;
}

const BadgeStats: React.FC<BadgeStatsProps> = ({ badgesList, employeesCount }) => {
  const activeBadges = badgesList.filter(badge => badge.status === 'success').length;
  const pendingBadges = badgesList.filter(badge => badge.status === 'warning').length;
  const inactiveBadges = badgesList.filter(badge => badge.status === 'danger').length;
  
  // Calculate coverage percentage
  const badgedEmployees = new Set(badgesList.map(badge => badge.employeeId)).size;
  const coveragePercentage = employeesCount ? Math.round((badgedEmployees / employeesCount) * 100) : 0;
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-green-50 border-green-200 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-800">Badges actifs</CardTitle>
          <BadgeCheck className="h-5 w-5 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-900">{activeBadges}</div>
          <p className="text-xs text-green-700">
            {activeBadges > 0 
              ? `${((activeBadges / badgesList.length) * 100).toFixed(1)}% du total`
              : "Aucun badge actif"}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-amber-50 border-amber-200 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-800">Badges en attente</CardTitle>
          <AlertCircle className="h-5 w-5 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-amber-900">{pendingBadges}</div>
          <p className="text-xs text-amber-700">
            {pendingBadges > 0
              ? `${pendingBadges} badge${pendingBadges > 1 ? 's' : ''} à valider`
              : "Aucun badge en attente"}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-red-50 border-red-200 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-800">Badges inactifs</CardTitle>
          <BadgeAlert className="h-5 w-5 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-900">{inactiveBadges}</div>
          <p className="text-xs text-red-700">
            {inactiveBadges > 0
              ? `${inactiveBadges} badge${inactiveBadges > 1 ? 's' : ''} désactivé${inactiveBadges > 1 ? 's' : ''}`
              : "Aucun badge inactif"}
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-blue-50 border-blue-200 hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">Couverture</CardTitle>
          <Users className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-900">{coveragePercentage}%</div>
          <p className="text-xs text-blue-700">
            {badgedEmployees} sur {employeesCount} employé{employeesCount > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeStats;
