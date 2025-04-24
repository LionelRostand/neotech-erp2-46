
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ViewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any;
}

const ViewAppointmentDialog = ({ open, onOpenChange, appointment }: ViewAppointmentDialogProps) => {
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
              {format(new Date(appointment.date), 'PPP', { locale: fr })}
            </dd>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Heure:</dt>
            <dd className="col-span-3">{appointment.time}</dd>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Client:</dt>
            <dd className="col-span-3">{appointment.clientName}</dd>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <dt className="text-sm font-medium text-gray-500">Service:</dt>
            <dd className="col-span-3">{appointment.service}</dd>
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
