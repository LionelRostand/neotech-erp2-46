
import React from 'react';
import { Check, X, MoreHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Leave } from '@/hooks/useLeaveData';
import { toast } from 'sonner';

interface LeaveActionMenuProps {
  leave: Leave;
  onStatusChange: (leaveId: string, newStatus: string) => Promise<boolean>;
}

export const LeaveActionMenu = ({ leave, onStatusChange }: LeaveActionMenuProps) => {
  if (!leave || !leave.id) {
    console.log("Warning: LeaveActionMenu received invalid leave data", leave);
    return null;
  }

  const isStatusChangeable = leave.status === 'pending' || leave.status === 'En attente';
  
  const handleApprove = async () => {
    if (!leave.id) return;
    
    try {
      const success = await onStatusChange(leave.id, 'Approuvé');
      if (success) {
        toast.success(`Congés de ${leave.employeeName || 'l\'employé'} approuvés`);
      }
    } catch (error) {
      console.error("Error approving leave:", error);
      toast.error("Erreur lors de l'approbation des congés");
    }
  };
  
  const handleReject = async () => {
    if (!leave.id) return;
    
    try {
      const success = await onStatusChange(leave.id, 'Refusé');
      if (success) {
        toast.success(`Congés de ${leave.employeeName || 'l\'employé'} refusés`);
      }
    } catch (error) {
      console.error("Error rejecting leave:", error);
      toast.error("Erreur lors du refus des congés");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isStatusChangeable ? (
          <>
            <DropdownMenuItem 
              onClick={handleApprove}
              className="text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
            >
              <Check className="mr-2 h-4 w-4" /> Approuver
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleReject}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
            >
              <X className="mr-2 h-4 w-4" /> Refuser
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem disabled>
            Statut déjà {leave.status === 'Approuvé' || leave.status === 'approved' ? 'approuvé' : 'refusé'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
