
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ViewAppointmentDialogProps {
  appointment: any;
  isOpen: boolean;
  onClose: () => void;
  getClientName: (clientId: string) => string;
  getVehicleInfo: (vehicleId: string) => string;
  getMechanicName: (mechanicId: string) => string;
  getServiceName: (serviceId: string) => string;
}

const ViewAppointmentDialog = ({ 
  appointment, 
  isOpen, 
  onClose,
  getClientName,
  getVehicleInfo,
  getMechanicName,
  getServiceName
}: ViewAppointmentDialogProps) => {
  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du rendez-vous</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Client:</span>
            <span className="col-span-2">{getClientName(appointment.clientId)}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Véhicule:</span>
            <span className="col-span-2">{getVehicleInfo(appointment.vehicleId)}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Date:</span>
            <span className="col-span-2">{appointment.date}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Heure:</span>
            <span className="col-span-2">{appointment.time}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Mécanicien:</span>
            <span className="col-span-2">{getMechanicName(appointment.mechanicId)}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Service:</span>
            <span className="col-span-2">{getServiceName(appointment.serviceId)}</span>
          </div>
          
          <div className="grid grid-cols-3 items-center gap-4">
            <span className="font-medium">Statut:</span>
            <span className="col-span-2">
              {appointment.status === 'scheduled' ? 'Prévu' :
               appointment.status === 'in-progress' ? 'En cours' :
               appointment.status === 'completed' ? 'Terminé' :
               appointment.status === 'cancelled' ? 'Annulé' : appointment.status}
            </span>
          </div>

          {appointment.notes && (
            <div className="grid grid-cols-3 items-start gap-4">
              <span className="font-medium">Notes:</span>
              <span className="col-span-2">{appointment.notes}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAppointmentDialog;
