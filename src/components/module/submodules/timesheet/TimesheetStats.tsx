
import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle, FileText } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TimesheetStatsProps {
  stats: {
    totalTimeSheets: number;
    pendingApproval: number;
    approved: number;
    rejected: number;
    completionRate: number;
  };
  isLoading: boolean;
}

const TimesheetStats: React.FC<TimesheetStatsProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return <StatCardsSkeleton />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      <StatCard
        title="Total feuilles"
        value={stats.totalTimeSheets.toString()}
        icon={<FileText className="h-5 w-5 text-blue-600" />}
        color="blue"
      />
      <StatCard
        title="En attente"
        value={stats.pendingApproval.toString()}
        icon={<Clock className="h-5 w-5 text-amber-600" />}
        color="amber"
      />
      <StatCard
        title="Validées"
        value={stats.approved.toString()}
        icon={<CheckCircle className="h-5 w-5 text-green-600" />}
        color="green"
      />
      <StatCard
        title="Rejetées"
        value={stats.rejected.toString()}
        icon={<XCircle className="h-5 w-5 text-red-600" />}
        color="red"
      />
      
      <Card className="p-4 col-span-1 md:col-span-2 xl:col-span-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
          <h3 className="font-medium text-sm">Taux de validation des feuilles</h3>
          <span className="text-sm text-muted-foreground">
            {stats.approved} sur {stats.totalTimeSheets} feuilles validées
          </span>
        </div>
        <div className="space-y-2">
          <Progress value={stats.completionRate} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{stats.completionRate}%</span>
            <span>100%</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'blue' | 'amber' | 'green' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const getBgColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-50';
      case 'amber': return 'bg-amber-50';
      case 'green': return 'bg-green-50';
      case 'red': return 'bg-red-50';
      default: return 'bg-gray-50';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${getBgColor()}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};

const StatCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map(i => (
        <Card key={i} className="p-6">
          <div className="flex justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-12" />
            </div>
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </Card>
      ))}
      
      <Card className="p-4 col-span-1 md:col-span-2 xl:col-span-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-8" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TimesheetStats;
