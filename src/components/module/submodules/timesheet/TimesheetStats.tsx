
import React from 'react';
import { TimeReport } from '@/types/timesheet';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle2, AlertCircle, Ban } from 'lucide-react';

interface TimesheetStatsProps {
  timesheetsList: TimeReport[];
}

const TimesheetStats: React.FC<TimesheetStatsProps> = ({ timesheetsList }) => {
  const stats = {
    enCours: timesheetsList.filter(ts => ts.status === 'En cours').length,
    soumis: timesheetsList.filter(ts => ts.status === 'Soumis').length,
    valide: timesheetsList.filter(ts => ts.status === 'Validé').length,
    rejete: timesheetsList.filter(ts => ts.status === 'Rejeté').length,
    total: timesheetsList.length
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">En cours</p>
              <div className="text-2xl font-bold">{stats.enCours}</div>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Soumis</p>
              <div className="text-2xl font-bold">{stats.soumis}</div>
            </div>
            <div className="p-2 bg-yellow-100 rounded-full">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Validés</p>
              <div className="text-2xl font-bold">{stats.valide}</div>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Rejetés</p>
              <div className="text-2xl font-bold">{stats.rejete}</div>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <Ban className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimesheetStats;
