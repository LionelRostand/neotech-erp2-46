
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, FileText, User, Building, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Absence } from '@/hooks/useAbsencesData';

interface AbsenceDetailsDialogProps {
  absence: Absence | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AbsenceDetailsDialog: React.FC<AbsenceDetailsDialogProps> = ({
  absence,
  open,
  onOpenChange
}) => {
  if (!absence) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Validé':
        return <Badge className="bg-green-100 text-green-800">Validé</Badge>;
      case 'Refusé':
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
      case 'En attente':
      default:
        return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Détails de l'absence</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* En-tête avec info employé */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-14 w-14">
              <AvatarImage src={absence.employeePhoto} alt={absence.employeeName} />
              <AvatarFallback>{absence.employeeName?.charAt(0) || '?'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-lg">{absence.employeeName}</h3>
              {absence.department && (
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{absence.department}</span>
                </div>
              )}
            </div>
            <div className="ml-auto">
              {getStatusBadge(absence.status)}
            </div>
          </div>
          
          {/* Informations d'absence */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Période</p>
                  <p className="font-medium">
                    Du {absence.startDate} au {absence.endDate}
                  </p>
                  <p className="text-sm text-gray-500">
                    {absence.days} jour{absence.days > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Type d'absence</p>
                  <p className="font-medium">{absence.type}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">ID Employé</p>
                  <p className="font-medium">{absence.employeeId}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Statut</p>
                  <p className="font-medium">{absence.status}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Raison */}
          {absence.reason && (
            <div className="border-t pt-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Raison</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{absence.reason}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <DialogClose asChild>
              <Button variant="outline">
                Fermer
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AbsenceDetailsDialog;
