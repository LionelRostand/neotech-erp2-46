
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { useHrModuleData } from '@/hooks/useHrModuleData';

interface ViewLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveRequest: any;
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

  // Find employee name
  const findEmployeeName = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Employé inconnu";
  };

  if (!leaveRequest) return null;

  // Status badge colors
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    canceled: "bg-gray-100 text-gray-800"
  };

  // Type badge colors
  const typeColors = {
    paid: "bg-blue-100 text-blue-800",
    unpaid: "bg-purple-100 text-purple-800",
    sick: "bg-orange-100 text-orange-800",
    maternity: "bg-pink-100 text-pink-800",
    paternity: "bg-indigo-100 text-indigo-800",
    other: "bg-teal-100 text-teal-800"
  };

  // Type labels
  const typeLabel = {
    paid: "Congé payé",
    unpaid: "Sans solde",
    sick: "Maladie",
    maternity: "Maternité",
    paternity: "Paternité",
    other: "Autre"
  };

  // Status labels
  const statusLabel = {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté",
    canceled: "Annulé"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de la demande de congé</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Employé:</div>
            <div className="col-span-3">{findEmployeeName(leaveRequest.employeeId)}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Type:</div>
            <div className="col-span-3">
              <Badge className={typeColors[leaveRequest.type as keyof typeof typeColors] || ""}>
                {typeLabel[leaveRequest.type as keyof typeof typeLabel] || leaveRequest.type}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Date de début:</div>
            <div className="col-span-3">{formatDateSafely(leaveRequest.startDate)}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Date de fin:</div>
            <div className="col-span-3">{formatDateSafely(leaveRequest.endDate)}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Statut:</div>
            <div className="col-span-3">
              <Badge className={statusColors[leaveRequest.status as keyof typeof statusColors] || ""}>
                {statusLabel[leaveRequest.status as keyof typeof statusLabel] || leaveRequest.status}
              </Badge>
            </div>
          </div>

          {leaveRequest.reason && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Motif:</div>
              <div className="col-span-3">{leaveRequest.reason}</div>
            </div>
          )}

          {leaveRequest.approvedBy && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Approuvé par:</div>
              <div className="col-span-3">{findEmployeeName(leaveRequest.approvedBy)}</div>
            </div>
          )}

          {leaveRequest.approvedAt && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="font-medium">Approuvé le:</div>
              <div className="col-span-3">{formatDateSafely(leaveRequest.approvedAt)}</div>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <div className="font-medium">Créé le:</div>
            <div className="col-span-3">{formatDateSafely(leaveRequest.createdAt)}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLeaveDialog;
