
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { usePermissions } from '@/hooks/usePermissions';
import { Trash } from 'lucide-react';

interface BadgePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBadge: BadgeData | null;
  selectedEmployee: Employee | null;
  onDeleteClick?: (badge: BadgeData) => void;
}

const BadgePreviewDialog: React.FC<BadgePreviewDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedBadge,
  selectedEmployee,
  onDeleteClick
}) => {
  const { isAdmin } = usePermissions('employees-badges');

  if (!selectedBadge) return null;

  const getBadgeStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du badge</DialogTitle>
          <DialogDescription>
            Informations détaillées sur le badge d'accès.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h3 className="font-medium text-lg">{selectedBadge.employeeName}</h3>
              {selectedEmployee?.department && (
                <span className="text-sm text-muted-foreground">{selectedEmployee.department}</span>
              )}
            </div>
            
            <div className="flex flex-col items-end">
              <Badge 
                variant={selectedBadge.status === 'success' ? 'default' : 
                       selectedBadge.status === 'warning' ? 'outline' : 
                       selectedBadge.status === 'danger' ? 'destructive' : 'secondary'}
              >
                {selectedBadge.statusText}
              </Badge>
              <span className="text-xs mt-1 text-muted-foreground">ID: {selectedBadge.id}</span>
            </div>
          </div>
          
          <div className="space-y-2 rounded-md border p-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Date d'émission</span>
              <span className="text-sm">{selectedBadge.date}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm font-medium">Niveau d'accès</span>
              <span className="text-sm">{selectedBadge.accessLevel}</span>
            </div>
            
            <div className="flex items-center mt-3">
              <div className={`w-4 h-4 rounded-full mr-2 ${getBadgeStatusColor(selectedBadge.status)}`}></div>
              <span className="text-sm">{selectedBadge.statusText}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fermer
          </Button>
          
          {isAdmin && onDeleteClick && (
            <Button 
              variant="destructive" 
              onClick={() => onDeleteClick(selectedBadge)}
              className="gap-2"
            >
              <Trash className="h-4 w-4" />
              Supprimer
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BadgePreviewDialog;
