
import React, { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { LeaveRequest } from './services/leaveService';
import LeaveDetailsDialog from './LeaveDetailsDialog';
import UpdateLeaveDialog from './UpdateLeaveDialog';
import DeleteLeaveDialog from './DeleteLeaveDialog';

interface LeaveRequestsTableProps {
  leaveRequests: LeaveRequest[];
  isLoading: boolean;
  onSuccess: () => void;
}

const LeaveRequestsTable: React.FC<LeaveRequestsTableProps> = ({ leaveRequests, isLoading, onSuccess }) => {
  const { employees } = useHrModuleData();
  
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Get employee name by ID
  const getEmployeeName = (id: string) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
  };
  
  // Format leave type for display
  const formatLeaveType = (type: string) => {
    const types = {
      paid: 'Congés payés',
      unpaid: 'Congés sans solde',
      sick: 'Maladie',
      maternity: 'Maternité',
      paternity: 'Paternité',
      other: 'Autre'
    };
    return types[type as keyof typeof types] || type;
  };
  
  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">En attente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Approuvée</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Refusée</Badge>;
      case 'canceled':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">Annulée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Handle actions
  const handleView = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setViewDialogOpen(true);
  };
  
  const handleEdit = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setUpdateDialogOpen(true);
  };
  
  const handleDelete = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setDeleteDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="w-full border rounded-md">
        <div className="p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employé</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Période</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaveRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Aucune demande de congé trouvée
                </TableCell>
              </TableRow>
            ) : (
              leaveRequests.map(leave => (
                <TableRow key={leave.id}>
                  <TableCell>{getEmployeeName(leave.employeeId)}</TableCell>
                  <TableCell>{formatLeaveType(leave.type)}</TableCell>
                  <TableCell>
                    {format(parseISO(leave.startDate), 'dd/MM/yyyy')} - {format(parseISO(leave.endDate), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{leave.durationDays || '-'} jour(s)</TableCell>
                  <TableCell>{getStatusBadge(leave.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(leave)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(leave)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(leave)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {selectedLeave && (
        <>
          <LeaveDetailsDialog
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            leave={selectedLeave}
            employees={employees}
          />
          <UpdateLeaveDialog
            open={updateDialogOpen}
            onOpenChange={setUpdateDialogOpen}
            leave={selectedLeave}
            onUpdateSuccess={onSuccess}
            employees={employees}
          />
          <DeleteLeaveDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            leave={selectedLeave}
            onDeleteSuccess={onSuccess}
          />
        </>
      )}
    </>
  );
};

export default LeaveRequestsTable;
