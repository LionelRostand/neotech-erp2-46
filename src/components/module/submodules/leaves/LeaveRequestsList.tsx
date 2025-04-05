
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useLeaveData, Leave } from '@/hooks/useLeaveData';

interface LeaveRequestsListProps {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const LeaveRequestsList: React.FC<LeaveRequestsListProps> = ({ 
  onApprove,
  onReject
}) => {
  const { leaves, isLoading, error } = useLeaveData();

  // Filter pending leave requests
  const pendingLeaves = leaves.filter(leave => leave.status === 'En attente');

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <p className="ml-2">Chargement des demandes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        Une erreur est survenue lors du chargement des demandes de congés.
      </div>
    );
  }

  if (pendingLeaves.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        Aucune demande de congé en attente
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Employé</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Période</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingLeaves.map((leave) => (
            <TableRow key={leave.id}>
              <TableCell className="font-medium">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={leave.employeePhoto} alt={leave.employeeName} />
                    <AvatarFallback>{leave.employeeName?.charAt(0) || '?'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{leave.employeeName}</p>
                    <p className="text-xs text-gray-500">{leave.department}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{leave.type}</TableCell>
              <TableCell>
                <span className="whitespace-nowrap">{leave.startDate}</span>
                <span className="mx-1">-</span>
                <span className="whitespace-nowrap">{leave.endDate}</span>
              </TableCell>
              <TableCell>{leave.days} jour{leave.days > 1 ? 's' : ''}</TableCell>
              <TableCell>
                <Badge
                  className={
                    leave.status === 'En attente'
                      ? 'bg-blue-100 text-blue-800'
                      : leave.status === 'Approuvé'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {leave.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onApprove(leave.id)}
                  className="text-green-600"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onReject(leave.id)}
                  className="text-red-600"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
