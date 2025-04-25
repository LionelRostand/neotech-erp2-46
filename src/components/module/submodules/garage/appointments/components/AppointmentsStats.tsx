
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle, Activity } from 'lucide-react';

interface AppointmentsStatsProps {
  scheduledCount: number;
  inProgressCount: number;
  completedCount: number;
  totalCount: number;
}

const AppointmentsStats: React.FC<AppointmentsStatsProps> = ({
  scheduledCount,
  inProgressCount,
  completedCount,
  totalCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Rendez-vous prévus</p>
              <h3 className="text-2xl font-bold">{scheduledCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">En cours</p>
              <h3 className="text-2xl font-bold">{inProgressCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Terminés</p>
              <h3 className="text-2xl font-bold">{completedCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-purple-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total</p>
              <h3 className="text-2xl font-bold">{totalCount}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsStats;
