
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Badges actifs</CardTitle>
          <BadgeCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeBadges}</div>
          <p className="text-xs text-muted-foreground">
            {activeBadges > 0 
              ? `${((activeBadges / badgesList.length) * 100).toFixed(1)}% du total`
              : "Aucun badge actif"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Badges en attente</CardTitle>
          <AlertCircle className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingBadges}</div>
          <p className="text-xs text-muted-foreground">
            {pendingBadges > 0
              ? `${pendingBadges} badge${pendingBadges > 1 ? 's' : ''} à valider`
              : "Aucun badge en attente"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Badges inactifs</CardTitle>
          <BadgeAlert className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactiveBadges}</div>
          <p className="text-xs text-muted-foreground">
            {inactiveBadges > 0
              ? `${inactiveBadges} badge${inactiveBadges > 1 ? 's' : ''} désactivé${inactiveBadges > 1 ? 's' : ''}`
              : "Aucun badge inactif"}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Couverture</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{coveragePercentage}%</div>
          <p className="text-xs text-muted-foreground">
            {badgedEmployees} sur {employeesCount} employé{employeesCount > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BadgeStats;
