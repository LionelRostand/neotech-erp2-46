
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import CreateAppointmentDialog from './CreateAppointmentDialog';
import AppointmentsStats from './components/AppointmentsStats';
import { fr } from 'date-fns/locale';

const GarageAppointmentsDashboard = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { appointments = [], clients = [], vehicles = [], isLoading } = useGarageData();
  
  const today = new Date().toISOString().split('T')[0];
  
  const todayAppointments = appointments.filter(a => a.date === today);
  const activeAppointments = appointments.filter(a => a.status === 'confirmed');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');

  // Helper function to safely format dates
  const safeFormatDate = (dateStr: string) => {
    try {
      // First check if the date string is valid
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return "Date invalide";
      }
      // Format the date as dd/MM/yyyy
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      console.error("Erreur lors du formatage de la date:", dateStr, error);
      return "Date invalide";
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rendez-vous</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <AppointmentsStats
        todayCount={todayAppointments.length}
        activeCount={activeAppointments.length}
        pendingCount={pendingAppointments.length}
        totalCount={appointments.length}
      />

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Liste des rendez-vous</h2>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{safeFormatDate(appointment.date)}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{appointment.vehicleMake} {appointment.vehicleModel}</TableCell>
                  <TableCell>{appointment.service || appointment.type}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <CreateAppointmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        clients={clients}
        vehicles={vehicles}
      />
    </div>
  );
};

export default GarageAppointmentsDashboard;
