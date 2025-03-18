
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

// Sample leave request data
const leaveRequests = [
  {
    id: 1,
    employee: { name: 'Thomas Martin', avatar: '', initials: 'TM' },
    type: 'Congés payés',
    startDate: '15/04/2025',
    endDate: '30/04/2025',
    duration: '12 jours',
    status: 'pending'
  },
  {
    id: 2,
    employee: { name: 'Sophie Dubois', avatar: '', initials: 'SD' },
    type: 'RTT',
    startDate: '05/04/2025',
    endDate: '05/04/2025',
    duration: '1 jour',
    status: 'approved'
  },
  {
    id: 3,
    employee: { name: 'Jean Dupont', avatar: '', initials: 'JD' },
    type: 'Maladie',
    startDate: '01/03/2025',
    endDate: '03/03/2025',
    duration: '3 jours',
    status: 'approved'
  },
  {
    id: 4,
    employee: { name: 'Marie Lefebvre', avatar: '', initials: 'ML' },
    type: 'Congés payés',
    startDate: '20/05/2025',
    endDate: '10/06/2025',
    duration: '15 jours',
    status: 'pending'
  },
  {
    id: 5,
    employee: { name: 'Pierre Bernard', avatar: '', initials: 'PB' },
    type: 'Congés sans solde',
    startDate: '12/07/2025',
    endDate: '19/07/2025',
    duration: '6 jours',
    status: 'rejected'
  }
];

export const LeaveRequestsList: React.FC = () => {
  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200">Refusé</Badge>;
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200">En attente</Badge>;
      default:
        return null;
    }
  };

  // Function to render row background based on status
  const getRowClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50';
      case 'rejected':
        return 'bg-red-50';
      default:
        return '';
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Demandes de congés</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Employé</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Type</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Date début</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Date fin</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Durée</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Statut</th>
              <th className="px-4 py-3 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.map((request) => (
              <tr 
                key={request.id} 
                className={`${getRowClass(request.status)} border-b border-gray-200 hover:bg-gray-50`}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={request.employee.avatar} />
                      <AvatarFallback>{request.employee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{request.employee.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">{request.type}</td>
                <td className="px-4 py-3 text-sm">{request.startDate}</td>
                <td className="px-4 py-3 text-sm">{request.endDate}</td>
                <td className="px-4 py-3 text-sm">{request.duration}</td>
                <td className="px-4 py-3 text-sm">{renderStatusBadge(request.status)}</td>
                <td className="px-4 py-3">
                  {request.status === 'pending' && (
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
