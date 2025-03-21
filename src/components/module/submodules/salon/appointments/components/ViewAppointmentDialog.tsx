
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SalonAppointment } from '../../types/salon-types';

interface ViewAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: SalonAppointment;
}

const ViewAppointmentDialog: React.FC<ViewAppointmentDialogProps> = ({
  open,
  onOpenChange,
  appointment
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-500">Confirmé</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulé</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Terminé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du rendez-vous</DialogTitle>
          <DialogDescription>
            Informations complètes sur le rendez-vous
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">ID:</span>
            <span>{appointment.id}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Date:</span>
            <span>{appointment.date}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Heure:</span>
            <span>{appointment.time}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Client:</span>
            <span>Client {appointment.clientId}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Service:</span>
            <span>{appointment.service}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Coiffeur:</span>
            <span>{appointment.stylist}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Durée:</span>
            <span>{appointment.duration} minutes</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-medium">Statut:</span>
            {getStatusBadge(appointment.status)}
          </div>
          
          {appointment.notes && (
            <div className="flex flex-col gap-2">
              <span className="font-medium">Notes:</span>
              <div className="bg-gray-100 p-2 rounded-md text-sm">
                {appointment.notes}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAppointmentDialog;
