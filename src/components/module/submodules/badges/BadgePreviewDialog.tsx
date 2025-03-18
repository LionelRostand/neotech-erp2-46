
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeIcon, User, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Employee } from '@/types/employee';
import { BadgeData, getInitials } from './BadgeTypes';

interface BadgePreviewDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  selectedBadge: BadgeData | null;
  selectedEmployee: Employee | null;
}

const BadgePreviewDialog: React.FC<BadgePreviewDialogProps> = ({
  isOpen,
  onOpenChange,
  selectedBadge,
  selectedEmployee
}) => {
  if (!selectedBadge || !selectedEmployee) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden">
        <div className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <BadgeIcon className="h-5 w-5" /> Badge Employé
          </DialogTitle>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col items-center">
            <Card className="w-full max-w-md bg-green-600 text-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-white text-green-600 flex items-center justify-center text-xl font-bold">
                    {getInitials(selectedEmployee.firstName, selectedEmployee.lastName)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{selectedEmployee.firstName}</h3>
                    <h3 className="text-xl font-bold">{selectedEmployee.lastName}</h3>
                    <div className="flex items-center gap-1 text-sm">
                      <BadgeIcon className="h-4 w-4" /> {selectedBadge.accessLevel}
                    </div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-white text-gray-700 rounded-md text-xs font-medium">
                  NEOTECH-CORP
                </div>
              </div>
              
              <div className="mt-6">
                <div className="bg-green-500 bg-opacity-50 p-4 rounded-md">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4" /> Département
                  </div>
                  <div className="text-lg font-bold mt-1">{selectedEmployee.department.toUpperCase()}</div>
                </div>
              </div>
            </Card>
            
            <Button className="w-full" onClick={() => toast.success("Badge téléchargé")}>
              <Download className="h-4 w-4 mr-2" /> Télécharger le badge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BadgePreviewDialog;
