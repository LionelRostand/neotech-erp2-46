
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import { SalonAppointment } from '../../types/salon-types';
import AppointmentsListSkeleton from './AppointmentsListSkeleton';
import EditAppointmentDialog from './EditAppointmentDialog';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';
import ViewAppointmentDialog from './ViewAppointmentDialog';

interface AppointmentsListProps {
  appointments: SalonAppointment[];
  isLoading: boolean;
  onUpdate: (id: string, data: Partial<SalonAppointment>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  isLoading,
  onUpdate,
  onDelete
}) => {
  const [selectedAppointment, setSelectedAppointment] = useState<SalonAppointment | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleView = (appointment: SalonAppointment) => {
    setSelectedAppointment(appointment);
    setViewDialogOpen(true);
  };

  const handleEdit = (appointment: SalonAppointment) => {
    setSelectedAppointment(appointment);
    setEditDialogOpen(true);
  };

  const handleDelete = (appointment: SalonAppointment) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
  };

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

  if (isLoading) {
    return <AppointmentsListSkeleton />;
  }

  return (
    <>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Heure</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Coiffeur</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  Aucun rendez-vous trouvé
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>Client {appointment.clientId}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>{appointment.stylist}</TableCell>
                  <TableCell>{appointment.duration} min</TableCell>
                  <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleView(appointment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(appointment)}>
                        <Edit className="h-4 w-4" />
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
            open={viewDialogOpen}
            onOpenChange={setViewDialogOpen}
            appointment={selectedAppointment}
          />
          <EditAppointmentDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            appointment={selectedAppointment}
            onUpdateAppointment={onUpdate}
          />
          <DeleteAppointmentDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            appointment={selectedAppointment}
            onDeleteAppointment={onDelete}
          />
        </>
      )}
    </>
  );
};

export default AppointmentsList;
