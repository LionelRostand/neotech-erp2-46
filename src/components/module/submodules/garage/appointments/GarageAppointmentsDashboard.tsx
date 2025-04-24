import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil, Trash2 } from "lucide-react";
import StatCard from '@/components/StatCard';
import { useGarageData } from '@/hooks/garage/useGarageData';
import CreateAppointmentDialog from './CreateAppointmentDialog';
import AppointmentViewDialog from './AppointmentViewDialog';
import AppointmentEditDialog from './AppointmentEditDialog';
import AppointmentDeleteDialog from './AppointmentDeleteDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGarageAppointments } from '@/hooks/garage/useGarageAppointments';

const GarageAppointmentsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const { appointments, vehicles, clients, isLoading } = useGarageData();
  const { refetchAppointments } = useGarageAppointments();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  const todayAppointments = appointments.filter(a => {
    const today = new Date().toISOString().split('T')[0];
    return a.date === today;
  });

  const upcomingAppointments = appointments.filter(a => 
    a.status === 'scheduled' && new Date(a.date) >= new Date()
  );

  const completedAppointments = appointments.filter(a => 
    a.status === 'completed'
  );

  const handleView = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowViewDialog(true);
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowEditDialog(true);
  };

  const handleDelete = (appointment: any) => {
    setSelectedAppointment(appointment);
    setShowDeleteDialog(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rendez-vous</h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Rendez-vous aujourd'hui"
          value={todayAppointments.length.toString()}
          icon={<Calendar className="h-4 w-4 text-blue-500" />}
          description="Planifiés pour aujourd'hui"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="Rendez-vous à venir"
          value={upcomingAppointments.length.toString()}
          icon={<Clock className="h-4 w-4 text-amber-500" />}
          description="En attente"
          className="bg-amber-50 hover:bg-amber-100"
        />
        <StatCard
          title="Rendez-vous terminés"
          value={completedAppointments.length.toString()}
          icon={<CheckCircle className="h-4 w-4 text-emerald-500" />}
          description="Ce mois-ci"
          className="bg-emerald-50 hover:bg-emerald-100"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prochains rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingAppointments.slice(0, 5).map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>
                    {vehicles.find(v => v.id === appointment.vehicleId)?.licensePlate || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        appointment.status === 'scheduled' 
                          ? 'secondary'
                          : appointment.status === 'completed'
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {appointment.status === 'scheduled' ? 'Planifié' 
                       : appointment.status === 'completed' ? 'Terminé'
                       : 'Annulé'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(appointment)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(appointment)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(appointment)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateAppointmentDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog}
        onSuccess={refetchAppointments}
      />
      
      {selectedAppointment && (
        <>
          <AppointmentViewDialog
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
            appointment={selectedAppointment}
          />
          
          <AppointmentEditDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            appointment={selectedAppointment}
            onSuccess={refetchAppointments}
          />
          
          <AppointmentDeleteDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            appointment={selectedAppointment}
            onSuccess={refetchAppointments}
          />
        </>
      )}
    </div>
  );
};

export default GarageAppointmentsDashboard;
