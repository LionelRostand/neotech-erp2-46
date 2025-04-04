
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Calendar,
  Filter,
  Plus,
  Check,
  X,
  Clock,
  FileText
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  type: 'congés payés' | 'maladie' | 'RTT' | 'sans solde' | 'autre';
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approver?: string;
  notes?: string;
}

const MOCK_LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    employeeName: 'Jean Dupont',
    employeeId: 'EMP001',
    startDate: '2023-06-12',
    endDate: '2023-06-23',
    type: 'congés payés',
    status: 'approved',
    requestDate: '2023-05-15',
    approver: 'Marie Martin'
  },
  {
    id: 'leave-2',
    employeeName: 'Sophie Lefebvre',
    employeeId: 'EMP002',
    startDate: '2023-07-03',
    endDate: '2023-07-07',
    type: 'RTT',
    status: 'pending',
    requestDate: '2023-06-20'
  },
  {
    id: 'leave-3',
    employeeName: 'Lucas Bernard',
    employeeId: 'EMP003',
    startDate: '2023-05-22',
    endDate: '2023-05-26',
    type: 'maladie',
    status: 'approved',
    requestDate: '2023-05-22',
    approver: 'Marie Martin',
    notes: 'Certificat médical reçu'
  },
  {
    id: 'leave-4',
    employeeName: 'Emma Petit',
    employeeId: 'EMP004',
    startDate: '2023-08-14',
    endDate: '2023-08-25',
    type: 'congés payés',
    status: 'pending',
    requestDate: '2023-06-28'
  },
  {
    id: 'leave-5',
    employeeName: 'Thomas Dubois',
    employeeId: 'EMP005',
    startDate: '2023-06-05',
    endDate: '2023-06-05',
    type: 'RTT',
    status: 'rejected',
    requestDate: '2023-05-25',
    approver: 'Marie Martin',
    notes: 'Période critique pour le projet'
  }
];

const EmployeesLeaves: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_LEAVE_REQUESTS);
  
  const handleApprove = (id: string) => {
    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status: 'approved', approver: 'Vous' } : request
    ));
    toast.success('Demande de congés approuvée');
  };

  const handleReject = (id: string) => {
    setLeaveRequests(leaveRequests.map(request => 
      request.id === id ? { ...request, status: 'rejected', approver: 'Vous' } : request
    ));
    toast.success('Demande de congés refusée');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Congés</h2>
          <p className="text-gray-500">Gestion des demandes de congés</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtres
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-blue-900">En attente</h3>
              <p className="text-2xl font-bold text-blue-700">
                {leaveRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-green-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-green-900">Approuvés</h3>
              <p className="text-2xl font-bold text-green-700">
                {leaveRequests.filter(r => r.status === 'approved').length}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-red-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-red-900">Refusés</h3>
              <p className="text-2xl font-bold text-red-700">
                {leaveRequests.filter(r => r.status === 'rejected').length}
              </p>
            </div>
            <X className="h-8 w-8 text-red-500" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total</h3>
              <p className="text-2xl font-bold text-gray-700">
                {leaveRequests.length}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-gray-500" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Type de congé</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Date de la demande</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Approuvé par</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map(request => (
                <TableRow key={request.id}>
                  <TableCell>{request.employeeName}</TableCell>
                  <TableCell>
                    <span className="capitalize">{request.type}</span>
                  </TableCell>
                  <TableCell>
                    {new Date(request.startDate).toLocaleDateString()} au {new Date(request.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{new Date(request.requestDate).toLocaleDateString()}</TableCell>
                  <TableCell>{getStatusBadge(request.status)}</TableCell>
                  <TableCell>{request.approver || '-'}</TableCell>
                  <TableCell className="text-right">
                    {request.status === 'pending' ? (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleApprove(request.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4 mr-1" /> Approuver
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReject(request.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" /> Refuser
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4 mr-1" /> Détails
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeesLeaves;
