
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface ViewLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveRequest: any; // Use a more specific type if available
}

const ViewLeaveDialog: React.FC<ViewLeaveDialogProps> = ({
  open,
  onOpenChange,
  leaveRequest
}) => {
  const { employees } = useHrModuleData();
  
  // Format date safely
  const formatDateSafely = (dateStr: string) => {
    if (!dateStr) return "Date invalide";
    try {
      return format(new Date(dateStr), 'dd MMMM yyyy', { locale: fr });
    } catch (err) {
      console.error("Date parsing error:", err);
      return "Date invalide";
    }
  };
  
  // Find employee details
  const findEmployee = (employeeId: string) => {
    return employees.find(emp => emp.id === employeeId);
  };
  
  // Get employee name
  const getEmployeeName = (employeeId: string) => {
    const employee = findEmployee(employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Employé inconnu";
  };
  
  // Status label mapping
  const statusLabels: Record<string, string> = {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté",
    canceled: "Annulé"
  };
  
  // Type label mapping
  const typeLabels: Record<string, string> = {
    paid: "Congé payé",
    unpaid: "Sans solde",
    sick: "Maladie",
    maternity: "Maternité",
    paternity: "Paternité",
    other: "Autre"
  };
  
  // Calculate duration in days
  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return "N/A";
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because inclusive
      return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    } catch (error) {
      console.error("Error calculating duration:", error);
      return "N/A";
    }
  };
  
  // Status badge colors
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    canceled: "bg-gray-100 text-gray-800"
  };

  // Type badge colors
  const typeColors: Record<string, string> = {
    paid: "bg-blue-100 text-blue-800",
    unpaid: "bg-purple-100 text-purple-800",
    sick: "bg-orange-100 text-orange-800",
    maternity: "bg-pink-100 text-pink-800",
    paternity: "bg-indigo-100 text-indigo-800",
    other: "bg-teal-100 text-teal-800"
  };

  if (!leaveRequest) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails de la demande de congé</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Employé:</span>
            <span className="col-span-2">{getEmployeeName(leaveRequest.employeeId)}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Type:</span>
            <span className="col-span-2">
              <Badge className={typeColors[leaveRequest.type] || "bg-gray-100"}>
                {typeLabels[leaveRequest.type] || leaveRequest.type}
              </Badge>
            </span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Du:</span>
            <span className="col-span-2">{formatDateSafely(leaveRequest.startDate)}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Au:</span>
            <span className="col-span-2">{formatDateSafely(leaveRequest.endDate)}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Durée:</span>
            <span className="col-span-2">{calculateDuration(leaveRequest.startDate, leaveRequest.endDate)}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Statut:</span>
            <span className="col-span-2">
              <Badge className={statusColors[leaveRequest.status] || "bg-gray-100"}>
                {statusLabels[leaveRequest.status] || leaveRequest.status}
              </Badge>
            </span>
          </div>
          
          {leaveRequest.reason && (
            <div className="grid grid-cols-3 items-start gap-4">
              <span className="font-medium">Raison:</span>
              <p className="col-span-2">{leaveRequest.reason}</p>
            </div>
          )}
          
          {leaveRequest.approvedBy && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Approuvé par:</span>
              <span className="col-span-2">{getEmployeeName(leaveRequest.approvedBy)}</span>
            </div>
          )}
          
          {leaveRequest.approvedAt && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Date d'approbation:</span>
              <span className="col-span-2">{formatDateSafely(leaveRequest.approvedAt)}</span>
            </div>
          )}
          
          {leaveRequest.createdAt && (
            <div className="grid grid-cols-3 items-center gap-4">
              <span className="font-medium">Créé le:</span>
              <span className="col-span-2">{formatDateSafely(leaveRequest.createdAt)}</span>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLeaveDialog;
