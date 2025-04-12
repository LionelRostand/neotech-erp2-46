
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { SunMedium, Clock, Calendar, AlertCircle } from 'lucide-react';

interface LeaveBalanceCardsProps {
  data?: {
    paidLeave: number;
    paidLeaveUsed: number;
    rtt: number;
    rttUsed: number;
    sickLeave: number;
    sickLeaveUsed: number;
    other: number;
    otherUsed: number;
  };
}

const LeaveBalanceCards: React.FC<LeaveBalanceCardsProps> = ({ 
  data = {
    paidLeave: 25,
    paidLeaveUsed: 10,
    rtt: 12,
    rttUsed: 4,
    sickLeave: 3,
    sickLeaveUsed: 1,
    other: 5,
    otherUsed: 0
  }
}) => {
  // Fonction pour calculer le pourcentage utilisé
  const getPercentage = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Congés payés</h3>
              <p className="text-2xl font-bold">{data.paidLeave - data.paidLeaveUsed} jours</p>
            </div>
            <SunMedium className="h-6 w-6 text-amber-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Utilisés: {data.paidLeaveUsed} jours</span>
              <span>Total: {data.paidLeave} jours</span>
            </div>
            <Progress value={getPercentage(data.paidLeaveUsed, data.paidLeave)} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-gray-700">RTT</h3>
              <p className="text-2xl font-bold">{data.rtt - data.rttUsed} jours</p>
            </div>
            <Clock className="h-6 w-6 text-blue-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Utilisés: {data.rttUsed} jours</span>
              <span>Total: {data.rtt} jours</span>
            </div>
            <Progress value={getPercentage(data.rttUsed, data.rtt)} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Congés maladie</h3>
              <p className="text-2xl font-bold">{data.sickLeave - data.sickLeaveUsed} jours</p>
            </div>
            <Calendar className="h-6 w-6 text-green-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Utilisés: {data.sickLeaveUsed} jours</span>
              <span>Total: {data.sickLeave} jours</span>
            </div>
            <Progress value={getPercentage(data.sickLeaveUsed, data.sickLeave)} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium text-gray-700">Autres congés</h3>
              <p className="text-2xl font-bold">{data.other - data.otherUsed} jours</p>
            </div>
            <AlertCircle className="h-6 w-6 text-purple-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Utilisés: {data.otherUsed} jours</span>
              <span>Total: {data.other} jours</span>
            </div>
            <Progress value={getPercentage(data.otherUsed, data.other)} className="h-2" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveBalanceCards;
