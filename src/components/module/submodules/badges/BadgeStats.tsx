
import React from 'react';
import { BadgeIcon, BadgeCheck, User } from 'lucide-react';
import StatCard from '@/components/StatCard';
import { BadgeData, BadgeStatsData } from './BadgeTypes';

interface BadgeStatsProps {
  badgesList: BadgeData[];
  employeesCount: number;
}

const BadgeStats: React.FC<BadgeStatsProps> = ({ badgesList, employeesCount }) => {
  // Stats data based on the badges list
  const statsData: BadgeStatsData[] = [
    {
      title: "Badges Actifs",
      value: badgesList.filter(badge => badge.status === "success").length.toString(),
      icon: <BadgeIcon className="h-8 w-8 text-neotech-primary" />,
      description: "Total des badges actuellement actifs"
    },
    {
      title: "Badges Attribués",
      value: badgesList.filter(badge => badge.status === "success").length.toString(),
      icon: <BadgeCheck className="h-8 w-8 text-green-500" />,
      description: "Badges assignés à des employés"
    },
    {
      title: "Badges En Attente",
      value: badgesList.filter(badge => badge.status === "warning").length.toString(),
      icon: <BadgeIcon className="h-8 w-8 text-amber-500" />,
      description: "Badges prêts à être attribués"
    },
    {
      title: "Employés",
      value: employeesCount.toString(),
      icon: <User className="h-8 w-8 text-blue-500" />,
      description: "Employés avec accès au système"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          description={stat.description}
        />
      ))}
    </div>
  );
};

export default BadgeStats;
