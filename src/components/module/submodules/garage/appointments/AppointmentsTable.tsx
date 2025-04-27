import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';

interface AppointmentsTableProps {
  appointments: any[];
  isLoading: boolean;
  getClientName: (clientId: string) => string;
  getVehicleInfo: (vehicleId: string) => string;
  getMechanicName: (mechanicId: string) => string;
  getServiceName: (serviceId: string) => string;
  onRefresh: () => void;
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({
  appointments,
  isLoading,
  getClientName,
  getVehicleInfo,
  getMechanicName,
  getServiceName,
  onRefresh
}) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const safeFormatValue = (value: any): string => {
    if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
      return new Date(value.seconds * 1000).toLocaleDateString();
    }
    return String(value || '');
  };

  const handleView = (appointment: any) => {
    setSelectedAppointment(appointment);
    setViewDialogOpen(true);
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setEditDialogOpen(true);
  };

  const handleDelete = (appointment: any) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
  };

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

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Véhicule</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>Mécanicien</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  Aucun rendez-vous trouvé
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{getClientName(appointment.clientId)}</TableCell>
                  <TableCell>{getVehicleInfo(appointment.vehicleId)}</TableCell>
                  <TableCell>{safeFormatValue(appointment.date)}</TableCell>
                  <TableCell>{safeFormatValue(appointment.time)}</TableCell>
                  <TableCell>{getMechanicName(appointment.mechanicId)}</TableCell>
                  <TableCell>{getServiceName(appointment.serviceId)}</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(appointment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(appointment)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(appointment)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedAppointment && (
        <>
          <ViewAppointmentDialog
            isOpen={viewDialogOpen}
            onClose={() => setViewDialogOpen(false)}
            appointment={selectedAppointment}
            getClientName={getClientName}
            getVehicleInfo={getVehicleInfo}
            getMechanicName={getMechanicName}
            getServiceName={getServiceName}
          />
          
          <EditAppointmentDialog
            isOpen={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            appointment={selectedAppointment}
            clients={[]}
            vehicles={[]}
            mechanics={[]}
            services={[]}
            onSuccess={() => {
              onRefresh();
              setEditDialogOpen(false);
            }}
          />
          
          <DeleteAppointmentDialog
            isOpen={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            appointment={selectedAppointment}
            getClientName={getClientName}
            getVehicleInfo={getVehicleInfo}
            onSuccess={() => {
              onRefresh();
              setDeleteDialogOpen(false);
            }}
          />
        </>
      )}
    </>
  );
};

export default AppointmentsTable;
