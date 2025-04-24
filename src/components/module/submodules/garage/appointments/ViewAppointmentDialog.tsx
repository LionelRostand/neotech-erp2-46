
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, isValid, parse } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ViewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any;
}

const ViewAppointmentDialog = ({ open, onOpenChange, appointment }: ViewAppointmentDialogProps) => {
  const formatAppointmentDate = (dateString: string) => {
    try {
      // First, try to parse the date directly
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isValid(date)) {
        return format(date, 'PPP', { locale: fr });
      }
      
      // If format is potentially DD/MM/YYYY, try to parse it
      const parsedDate = parse(dateString, 'dd/MM/yyyy', new Date());
      if (isValid(parsedDate)) {
        return format(parsedDate, 'PPP', { locale: fr });
      }
      
      // Fallback to displaying the raw string if parsing fails
      return dateString;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du rendez-vous</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Date:</dt>
            <dd className="col-span-3">
              {appointment.date ? formatAppointmentDate(appointment.date) : 'Non spécifiée'}
            </dd>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Heure:</dt>
            <dd className="col-span-3">{appointment.time || 'Non spécifiée'}</dd>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Client:</dt>
            <dd className="col-span-3">{appointment.clientName || 'Non spécifié'}</dd>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Service:</dt>
            <dd className="col-span-3">{appointment.service || 'Non spécifié'}</dd>
          </div>
          
          {appointment.notes && (
            <div className="grid grid-cols-4 items-center gap-4">
              <dt className="text-sm font-medium text-gray-500">Notes:</dt>
              <dd className="col-span-3">{appointment.notes}</dd>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAppointmentDialog;
