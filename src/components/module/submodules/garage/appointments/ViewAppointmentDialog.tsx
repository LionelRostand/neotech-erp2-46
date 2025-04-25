
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ViewAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: any;
  getClientName: (clientId: string) => string;
  getVehicleInfo: (vehicleId: string) => string;
  getMechanicName: (mechanicId: string) => string;
  getServiceName: (serviceId: string) => string;
}

const ViewAppointmentDialog = ({ 
  isOpen, 
  onClose,
  appointment,
  getClientName,
  getVehicleInfo,
  getMechanicName,
  getServiceName
}: ViewAppointmentDialogProps) => {
  if (!appointment) return null;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Prévu</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-500 hover:bg-green-600">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Annulé</Badge>;
      default:
        return <Badge variant="outline">Prévu</Badge>;
    }
  };

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
              {getStatusBadge(appointment.status)}
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
