
import React from 'react';
import { Employee } from '@/types/employee';
import { CalendarDays, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface CongesTabProps {
  employee: Employee;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  // Mock data for absences (in a real app, fetch this from your database)
  const absences = employee.absences || [];
  
  // Leave entitlements
  const leaveEntitlements = {
    paidLeave: { total: 25, used: 12, remaining: 13 },
    rtt: { total: 10, used: 4, remaining: 6 },
    sickLeave: { total: 3, used: 1, remaining: 2 }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Calculate number of days between two dates
  const calculateDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end day
    return diffDays;
  };
  
  // Get status color
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-amber-100 text-amber-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get status display text
  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'approved': return 'Approuvé';
      case 'pending': return 'En attente';
      case 'rejected': return 'Refusé';
      default: return status;
    }
  };
  
  // Get type display text
  const getTypeDisplay = (type: string) => {
    switch(type) {
      case 'vacation': return 'Congés payés';
      case 'rtt': return 'RTT';
      case 'sick': return 'Maladie';
      case 'personal': return 'Personnel';
      case 'maternity': return 'Maternité';
      case 'paternity': return 'Paternité';
      case 'bereavement': return 'Deuil';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Congés payés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Utilisés: {leaveEntitlements.paidLeave.used} jours</span>
              <span>Total: {leaveEntitlements.paidLeave.total} jours</span>
            </div>
            <Progress value={(leaveEntitlements.paidLeave.used / leaveEntitlements.paidLeave.total) * 100} className="h-2" />
            <p className="mt-2 text-sm font-semibold">
              Restants: {leaveEntitlements.paidLeave.remaining} jours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">RTT</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Utilisés: {leaveEntitlements.rtt.used} jours</span>
              <span>Total: {leaveEntitlements.rtt.total} jours</span>
            </div>
            <Progress value={(leaveEntitlements.rtt.used / leaveEntitlements.rtt.total) * 100} className="h-2" />
            <p className="mt-2 text-sm font-semibold">
              Restants: {leaveEntitlements.rtt.remaining} jours
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Maladie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Utilisés: {leaveEntitlements.sickLeave.used} jours</span>
              <span>Total: {leaveEntitlements.sickLeave.total} jours</span>
            </div>
            <Progress value={(leaveEntitlements.sickLeave.used / leaveEntitlements.sickLeave.total) * 100} className="h-2" />
            <p className="mt-2 text-sm font-semibold">
              Restants: {leaveEntitlements.sickLeave.remaining} jours
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Historique des absences</h3>
        
        {absences.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border rounded-md">
            <CalendarDays className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2">Aucune absence enregistrée</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durée</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motif</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {absences.map((absence, index) => (
                  <tr key={absence.id || index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {getTypeDisplay(absence.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {formatDate(absence.startDate)} - {formatDate(absence.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        {calculateDays(absence.startDate, absence.endDate)} jours
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(absence.status)}`}>
                        {getStatusDisplay(absence.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {absence.reason || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CongesTab;
