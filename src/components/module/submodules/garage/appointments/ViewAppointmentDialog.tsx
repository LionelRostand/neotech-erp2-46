
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import StatusBadge from '@/components/StatusBadge';

interface ViewAppointmentDialogProps {
  appointment: any;
  open: boolean;
  onClose: () => void;
}

const ViewAppointmentDialog = ({ appointment, open, onClose }: ViewAppointmentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Détails du rendez-vous</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="font-medium">Client:</label>
            <p>{appointment.clientName}</p>
          </div>
          <div>
            <label className="font-medium">Date:</label>
            <p>{format(new Date(appointment.date), 'dd MMMM yyyy', { locale: fr })}</p>
          </div>
          <div>
            <label className="font-medium">Heure:</label>
            <p>{appointment.time}</p>
          </div>
          <div>
            <label className="font-medium">Type:</label>
            <p>{appointment.type}</p>
          </div>
          <div>
            <label className="font-medium">Statut:</label>
            <StatusBadge status={appointment.status}>
              {appointment.status === 'pending' ? 'En attente' :
               appointment.status === 'confirmed' ? 'Confirmé' :
               appointment.status === 'canceled' ? 'Annulé' :
               appointment.status === 'completed' ? 'Terminé' : 
               appointment.status}
            </StatusBadge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAppointmentDialog;
