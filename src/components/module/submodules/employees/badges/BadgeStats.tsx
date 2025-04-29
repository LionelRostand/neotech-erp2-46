
import React from 'react';
import { BadgeIcon, Check, User } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { BadgeData } from './BadgeTypes';

interface BadgeStatsProps {
  badgesList: BadgeData[];
  employeesCount: number;
}

const BadgeStats: React.FC<BadgeStatsProps> = ({ badgesList = [], employeesCount = 0 }) => {
  // Ensure badgesList is an array
  const safeBadgesList = Array.isArray(badgesList) ? badgesList : [];

  // Calculate active badges (success status)
  const activeBadges = safeBadgesList.filter(badge => badge.status === "success").length;
  
  // Calculate pending badges (warning status)
  const pendingBadges = safeBadgesList.filter(badge => badge.status === "warning").length;
  
  // Calculate disabled badges (danger status)
  const disabledBadges = safeBadgesList.filter(badge => badge.status === "danger").length;
  
  // Calculate percentage of employees with badges
  const employeesWithBadgesPercentage = employeesCount > 0 
    ? Math.round((activeBadges / employeesCount) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Badges Actifs"
        value={activeBadges.toString()}
        icon={<Check className="h-8 w-8 text-green-500" />}
        description="Total des badges actuellement actifs"
      />
      
      <StatCard
        title="Badges En Attente"
        value={pendingBadges.toString()}
        icon={<BadgeIcon className="h-8 w-8 text-amber-500" />}
        description="Badges en attente d'activation"
      />
      
      <StatCard
        title="Badges Désactivés"
        value={disabledBadges.toString()}
        icon={<BadgeIcon className="h-8 w-8 text-red-500" />}
        description="Badges désactivés ou expirés"
      />
      
      <StatCard
        title="Employés"
        value={`${employeesWithBadgesPercentage}%`}
        icon={<User className="h-8 w-8 text-blue-500" />}
        description={`${activeBadges}/${employeesCount} employés avec badge`}
      />
    </div>
  );
};

export default BadgeStats;
