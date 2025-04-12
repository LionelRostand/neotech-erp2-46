
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, User, MessageSquare, Briefcase } from 'lucide-react';
import { Leave } from '@/hooks/useLeaveData';

interface LeaveDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  leave: Leave | null;
}

const LeaveDetailsDialog: React.FC<LeaveDetailsDialogProps> = ({
  isOpen,
  onClose,
  leave
}) => {
  if (!leave) return null;

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('approuvé')) {
      return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
    }
    if (statusLower.includes('rejected') || statusLower.includes('refusé')) {
      return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
  };
  
  const getInitials = (name: string) => {
    try {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
    } catch (e) {
      return 'U';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Détails de la demande de congé</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              {leave.employeePhoto ? (
                <AvatarImage src={leave.employeePhoto} alt={leave.employeeName} />
              ) : null}
              <AvatarFallback>{getInitials(leave.employeeName)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{leave.employeeName}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="mr-1 h-4 w-4" />
                {leave.department || 'Département non spécifié'}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-sm font-medium">Type de congé</p>
              <p>{leave.type}</p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Statut</p>
              <div>{getStatusBadge(leave.status)}</div>
            </div>
            
            <div className="space-y-1 col-span-2">
              <p className="text-sm font-medium">Période</p>
              <div className="flex items-center text-sm">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                <span>Du {leave.startDate} au {leave.endDate} ({leave.days} jour{leave.days > 1 ? 's' : ''})</span>
              </div>
            </div>
            
            <div className="space-y-1 col-span-2">
              <p className="text-sm font-medium">Date de la demande</p>
              <div className="flex items-center text-sm">
                <Clock className="mr-2 h-4 w-4 text-gray-500" />
                <span>{leave.requestDate}</span>
              </div>
            </div>
            
            {leave.reason && (
              <div className="space-y-1 col-span-2">
                <p className="text-sm font-medium">Motif</p>
                <div className="flex items-start">
                  <MessageSquare className="mr-2 h-4 w-4 text-gray-500 mt-1" />
                  <p className="text-sm">{leave.reason}</p>
                </div>
              </div>
            )}
            
            {leave.approvedBy && (
              <div className="space-y-1 col-span-2">
                <p className="text-sm font-medium">Traité par</p>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-gray-500" />
                  <p className="text-sm">{leave.approvedBy}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveDetailsDialog;
