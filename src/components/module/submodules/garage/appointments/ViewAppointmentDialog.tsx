import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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

const ViewAppointmentDialog: React.FC<ViewAppointmentDialogProps> = ({
  isOpen,
  onClose,
  appointment,
  getClientName,
  getVehicleInfo,
  getMechanicName,
  getServiceName,
}) => {
  // Helper function to safely format Firebase timestamp objects or any other data
  const safeFormatValue = (value: any): string => {
    // Check if the value is a Firebase timestamp object (has seconds and nanoseconds)
    if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
      // Convert Firebase timestamp to JavaScript Date and then to string
      return new Date(value.seconds * 1000).toLocaleDateString();
    }
    
    // Otherwise, just return the value as a string or empty string if undefined
    return String(value || '');
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'scheduled':
        return <Badge className="bg-blue-500">Prévu</Badge>;
      case 'in-progress':
        return <Badge className="bg-yellow-500">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Annulé</Badge>;
      default:
        return <Badge variant="outline">Prévu</Badge>;
    }
  };

  if (!appointment) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du rendez-vous</DialogTitle>
          <DialogDescription>
            Informations complètes sur le rendez-vous
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Client:</span>
            <span>{getClientName(appointment.clientId)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Véhicule:</span>
            <span>{getVehicleInfo(appointment.vehicleId)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Date:</span>
            <span>{safeFormatValue(appointment.date)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Heure:</span>
            <span>{safeFormatValue(appointment.time)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Mécanicien:</span>
            <span>{getMechanicName(appointment.mechanicId)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Service:</span>
            <span>{getServiceName(appointment.serviceId)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <span className="font-medium">Statut:</span>
            <span>{getStatusBadge(appointment.status)}</span>
          </div>

          {appointment.notes && (
            <div className="col-span-2 mt-2">
              <span className="font-medium">Notes:</span>
              <p className="mt-1 text-sm p-2 bg-gray-50 rounded-md">{appointment.notes}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAppointmentDialog;
