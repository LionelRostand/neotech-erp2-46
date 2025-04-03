
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, AlertCircle, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLeaveData } from '@/hooks/useLeaveData';

interface LeaveRequestsListProps {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const LeaveRequestsList = ({ onApprove, onReject }: LeaveRequestsListProps) => {
  const { leaves, isLoading, error } = useLeaveData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
        <p className="ml-2 text-gray-500">Chargement des demandes de congés...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="ml-2 text-red-500">Erreur lors du chargement des données</p>
      </div>
    );
  }

  if (!leaves || leaves.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Aucune demande de congé trouvée</p>
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
            <TableHead>Date début</TableHead>
            <TableHead>Date fin</TableHead>
            <TableHead>Jours</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaves.map((leave) => (
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
              <TableCell>{leave.startDate}</TableCell>
              <TableCell>{leave.endDate}</TableCell>
              <TableCell>{leave.days}</TableCell>
              <TableCell>
                <Badge
                  className={
                    leave.status === 'Approuvé'
                      ? 'bg-green-100 text-green-800'
                      : leave.status === 'Refusé'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {leave.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {leave.status === 'En attente' && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onApprove(leave.id)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Approuver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReject(leave.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Refuser
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
