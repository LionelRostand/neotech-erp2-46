
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { BadgeData } from './BadgeTypes';
import { Employee } from '@/types/employee';
import { AlignJustify, Building, Calendar, User, ShieldCheck, Info, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface BadgePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
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
  if (!selectedBadge) return null;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  const handleDelete = () => {
    if (onDeleteClick && selectedBadge) {
      onDeleteClick(selectedBadge);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div>Détails du badge</div>
            {onDeleteClick && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[75vh]">
          <div className="space-y-6 p-2">
            <div className="flex flex-col items-center justify-center py-6 text-center bg-gray-50 rounded-lg">
              <Avatar className="h-24 w-24 mb-4">
                {selectedEmployee?.photoURL ? (
                  <AvatarImage src={selectedEmployee.photoURL} alt={selectedBadge.employeeName} />
                ) : (
                  <AvatarFallback className="text-2xl">{getInitials(selectedBadge.employeeName)}</AvatarFallback>
                )}
              </Avatar>
              <h3 className="text-xl font-bold mb-1">{selectedBadge.employeeName}</h3>
              <p className="text-muted-foreground">{selectedBadge.department}</p>
              <div className="mt-4 flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
                <span className="text-primary font-medium">{selectedBadge.accessLevel}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Info className="h-4 w-4 mr-2" />
                  Numéro de badge
                </p>
                <p className="font-medium">{selectedBadge.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Date de création
                </p>
                <p className="font-medium">{selectedBadge.date}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  ID Employé
                </p>
                <p className="font-medium">{selectedBadge.employeeId}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Entreprise
                </p>
                <p className="font-medium">{selectedBadge.company || "Non spécifiée"}</p>
              </div>
            </div>
            
            {selectedEmployee && (
              <div className="border-t pt-4 mt-4">
                <h4 className="font-medium mb-3">Informations supplémentaires</h4>
                <div className="grid grid-cols-2 gap-4">
                  {selectedEmployee.email && (
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{selectedEmployee.email}</p>
                    </div>
                  )}
                  {selectedEmployee.phone && (
                    <div className="space-y-1 col-span-2">
                      <p className="text-sm text-muted-foreground">Téléphone</p>
                      <p className="font-medium">{selectedEmployee.phone}</p>
                    </div>
                  )}
                  {selectedEmployee.position && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Poste</p>
                      <p className="font-medium">{selectedEmployee.position}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BadgePreviewDialog;
