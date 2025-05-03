
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/types/employee';
import { LeaveRequest } from './services/leaveService';

interface LeaveDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leave: LeaveRequest;
  employees: Employee[];
}

const LeaveDetailsDialog: React.FC<LeaveDetailsDialogProps> = ({ open, onOpenChange, leave, employees }) => {
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
  
  // Get approver name by ID
  const getApproverName = (id?: string) => {
    if (!id) return '-';
    const employee = employees.find(emp => emp.id === id);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Employé inconnu';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la demande de congé</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex justify-between">
            <div className="font-medium">Employé</div>
            <div>{getEmployeeName(leave.employeeId)}</div>
          </div>
          
          <div className="flex justify-between">
            <div className="font-medium">Type de congé</div>
            <div>{formatLeaveType(leave.type)}</div>
          </div>
          
          <div className="flex justify-between">
            <div className="font-medium">Période</div>
            <div>
              Du {format(parseISO(leave.startDate), 'dd MMMM yyyy', { locale: fr })}
              <br />
              Au {format(parseISO(leave.endDate), 'dd MMMM yyyy', { locale: fr })}
            </div>
          </div>
          
          <div className="flex justify-between">
            <div className="font-medium">Durée</div>
            <div>{leave.durationDays || '-'} jour(s)</div>
          </div>
          
          <div className="flex justify-between">
            <div className="font-medium">Statut</div>
            <div>{getStatusBadge(leave.status)}</div>
          </div>
          
          {leave.reason && (
            <div className="space-y-2">
              <div className="font-medium">Motif</div>
              <div className="p-3 bg-gray-50 rounded-md">{leave.reason}</div>
            </div>
          )}
          
          {leave.approvedBy && (
            <div className="flex justify-between">
              <div className="font-medium">Approuvé par</div>
              <div>{getApproverName(leave.approvedBy)}</div>
            </div>
          )}
          
          {leave.approvedAt && (
            <div className="flex justify-between">
              <div className="font-medium">Date d'approbation</div>
              <div>{format(parseISO(leave.approvedAt), 'dd MMMM yyyy', { locale: fr })}</div>
            </div>
          )}
          
          <div className="flex justify-between">
            <div className="font-medium">Créée le</div>
            <div>{format(parseISO(leave.createdAt), 'dd MMMM yyyy', { locale: fr })}</div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveDetailsDialog;
