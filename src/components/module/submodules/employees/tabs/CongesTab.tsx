
import React from 'react';
import { Employee, LeaveRequest } from '@/types/employee';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StatusBadge } from '@/components/ui/status-badge';

interface CongesTabProps {
  employee: Employee;
}

const CongesTab: React.FC<CongesTabProps> = ({ employee }) => {
  // Make sure leaveRequests is always an array
  const leaveRequests = Array.isArray(employee.leaveRequests) ? employee.leaveRequests : [];

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'en attente':
        return 'En attente';
      case 'approved':
      case 'approuvé':
        return 'Approuvé';
      case 'rejected':
      case 'refusé':
        return 'Refusé';
      default:
        return status;
    }
  };

  // Calculate leaves balance
  const conges = employee.conges || { acquired: 25, taken: 0, balance: 25 };
  const rtt = employee.rtt || { acquired: 10, taken: 0, balance: 10 };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Gestion des congés</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium">Congés payés</h4>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div className="text-center">
              <p className="text-sm text-gray-500">Acquis</p>
              <p className="text-xl font-semibold">{conges.acquired}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Pris</p>
              <p className="text-xl font-semibold">{conges.taken}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Solde</p>
              <p className="text-xl font-semibold">{conges.balance}</p>
            </div>
          </div>
        </div>
        
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium">RTT</h4>
          <div className="grid grid-cols-3 gap-4 mt-3">
            <div className="text-center">
              <p className="text-sm text-gray-500">Acquis</p>
              <p className="text-xl font-semibold">{rtt.acquired}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Pris</p>
              <p className="text-xl font-semibold">{rtt.taken}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Solde</p>
              <p className="text-xl font-semibold">{rtt.balance}</p>
            </div>
          </div>
        </div>
      </div>
      
      <h4 className="font-medium">Historique des demandes</h4>
      
      {leaveRequests.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">Aucune demande</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aucune demande de congé n'a été enregistrée pour cet employé.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaveRequests.map((request, index) => (
            <div key={index} className="p-4 border rounded-lg bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{request.type || 'Congé'}</p>
                  <p className="text-sm text-gray-500">
                    Du {formatDate(request.startDate)} au {formatDate(request.endDate)}
                  </p>
                </div>
                <StatusBadge status={request.status}>
                  {getStatusText(request.status)}
                </StatusBadge>
              </div>
              {request.comments && (
                <p className="mt-2 text-sm text-gray-600 border-t pt-2">
                  {request.comments}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CongesTab;
