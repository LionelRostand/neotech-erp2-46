
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';

interface BadgePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBadge: BadgeData | null;
  selectedEmployee: Employee | null;
}

const BadgePreviewDialog: React.FC<BadgePreviewDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedBadge,
  selectedEmployee
}) => {
  if (!selectedBadge) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] p-0">
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 text-white p-8 rounded-t-lg flex flex-col items-center">
          <div className="text-2xl font-bold mb-1">Badge d'accès</div>
          <div className="text-blue-100 mb-6">{selectedBadge.id}</div>
          
          <Avatar className="h-24 w-24 border-4 border-white mb-3">
            {selectedEmployee && (selectedEmployee.photoURL || selectedEmployee.photo) ? (
              <AvatarImage src={selectedEmployee.photoURL || selectedEmployee.photo || ''} />
            ) : null}
            <AvatarFallback className="bg-blue-500 text-xl">
              {selectedEmployee ? (
                `${selectedEmployee.firstName?.[0] || ''}${selectedEmployee.lastName?.[0] || ''}`
              ) : (
                selectedBadge.employeeName.split(' ').map(n => n[0]).join('')
              )}
            </AvatarFallback>
          </Avatar>
          
          <div className="text-xl font-semibold">{selectedBadge.employeeName}</div>
          <div className="text-blue-100 mb-4">{selectedBadge.department}</div>
          
          <Badge className="bg-blue-800 hover:bg-blue-800 text-white border border-blue-400 px-4 py-1">
            {selectedBadge.accessLevel}
          </Badge>
        </div>
        
        <div className="p-6 bg-white">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="font-semibold text-gray-500">Date de création:</div>
            <div>{selectedBadge.date}</div>
            
            <div className="font-semibold text-gray-500">Statut:</div>
            <div>
              <Badge
                variant={selectedBadge.status === 'success' ? 'default' : 
                       selectedBadge.status === 'warning' ? 'outline' : 
                       selectedBadge.status === 'danger' ? 'destructive' : 'secondary'}
              >
                {selectedBadge.statusText}
              </Badge>
            </div>
            
            <div className="font-semibold text-gray-500">ID Employé:</div>
            <div>{selectedBadge.employeeId}</div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgePreviewDialog;
