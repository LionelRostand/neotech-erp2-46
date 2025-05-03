
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, CheckCheck, AlertCircle } from 'lucide-react';
import { LeaveRequest } from './services/leaveService';

interface LeaveStatsProps {
  leaveRequests: LeaveRequest[];
}

const LeaveStats: React.FC<LeaveStatsProps> = ({ leaveRequests }) => {
  // Calculate statistics
  const stats = useMemo(() => {
    const pending = leaveRequests.filter(leave => leave.status === 'pending').length;
    const approved = leaveRequests.filter(leave => leave.status === 'approved').length;
    const rejected = leaveRequests.filter(leave => leave.status === 'rejected').length;
    
    const totalDays = leaveRequests.reduce((sum, leave) => {
      if (leave.status === 'approved' && leave.durationDays) {
        return sum + leave.durationDays;
      }
      return sum;
    }, 0);
    
    return {
      pending,
      approved,
      rejected,
      total: leaveRequests.length,
      totalDays
    };
  }, [leaveRequests]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-start">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <Calendar className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Total demandes</h3>
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-gray-500">{stats.totalDays} jours accordés</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-start">
          <div className="bg-yellow-100 p-3 rounded-full mr-4">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">En attente</h3>
            <p className="text-2xl font-bold">{stats.pending}</p>
            <p className="text-sm text-gray-500">{Math.round(stats.pending / stats.total * 100) || 0}% des demandes</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-start">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <CheckCheck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Approuvées</h3>
            <p className="text-2xl font-bold">{stats.approved}</p>
            <p className="text-sm text-gray-500">{Math.round(stats.approved / stats.total * 100) || 0}% des demandes</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex items-start">
          <div className="bg-red-100 p-3 rounded-full mr-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Refusées</h3>
            <p className="text-2xl font-bold">{stats.rejected}</p>
            <p className="text-sm text-gray-500">{Math.round(stats.rejected / stats.total * 100) || 0}% des demandes</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaveStats;
