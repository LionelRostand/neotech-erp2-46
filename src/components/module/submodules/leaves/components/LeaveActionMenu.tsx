
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
  const isStatusChangeable = leave.status === 'pending' || leave.status === 'En attente';
  
  const handleApprove = async () => {
    const success = await onStatusChange(leave.id, 'Approuvé');
    if (success) {
      toast.success(`Congés de ${leave.employeeName} approuvés`);
    }
  };
  
  const handleReject = async () => {
    const success = await onStatusChange(leave.id, 'Refusé');
    if (success) {
      toast.success(`Congés de ${leave.employeeName} refusés`);
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
