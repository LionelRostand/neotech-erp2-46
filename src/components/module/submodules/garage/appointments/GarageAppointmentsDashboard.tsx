import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGarageAppointments } from '@/hooks/garage/useGarageAppointments';
import { toast } from "sonner";
import CreateAppointmentDialog from './CreateAppointmentDialog';
import AppointmentViewDialog from './AppointmentViewDialog';
import AppointmentEditDialog from './AppointmentEditDialog';
import AppointmentDeleteDialog from './AppointmentDeleteDialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const GarageAppointmentsDashboard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { appointments, refetchAppointments, loading, error } = useGarageAppointments();

  const formattedDate = date ? format(date, 'PPP', { locale: fr }) : 'Sélectionner une date';

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleAddAppointment = () => {
    setShowAddDialog(true);
  };

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowViewDialog(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowEditDialog(true);
  };

  const handleDeleteAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowDeleteDialog(true);
  };

  const onAppointmentSuccess = () => {
    refetchAppointments();
  };

  if (loading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-96">Erreur: {error.message}</div>;
  }

  const filteredAppointments = date
    ? appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date);
        return (
          appointmentDate.getDate() === date.getDate() &&
          appointmentDate.getMonth() === date.getMonth() &&
          appointmentDate.getFullYear() === date.getFullYear()
        );
      })
    : appointments;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rendez-vous</h1>
        <Button onClick={handleAddAppointment}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sélectionner une date</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous pour le {formattedDate}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{format(new Date(appointment.date), 'dd/MM/yyyy', { locale: fr })}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>
                    <Badge variant={appointment.status === 'completed' ? 'default' : appointment.status === 'scheduled' ? 'secondary' : 'destructive'}>
                      {appointment.status === 'scheduled' ? 'Planifié' : appointment.status === 'completed' ? 'Terminé' : 'Annulé'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewAppointment(appointment)}>
                      Voir
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditAppointment(appointment)}>
                      Modifier
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteAppointment(appointment)}>
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateAppointmentDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSuccess={onAppointmentSuccess} />
      <AppointmentViewDialog open={showViewDialog} onOpenChange={setShowViewDialog} appointment={selectedAppointment} />
      <AppointmentEditDialog open={showEditDialog} onOpenChange={setShowEditDialog} appointment={selectedAppointment} onSuccess={onAppointmentSuccess} />
      <AppointmentDeleteDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog} appointment={selectedAppointment} onSuccess={onAppointmentSuccess} />
    </div>
  );
};

export default GarageAppointmentsDashboard;
