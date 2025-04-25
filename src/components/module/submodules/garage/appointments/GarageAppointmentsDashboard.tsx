
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useGarageData } from '@/hooks/garage/useGarageData';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import AppointmentsStats from './components/AppointmentsStats';

const GarageAppointmentsDashboard = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const { appointments = [], isLoading } = useGarageData();
  
  const today = new Date().toISOString().split('T')[0];
  
  const todayAppointments = appointments.filter(a => a.date === today);
  const activeAppointments = appointments.filter(a => a.status === 'confirmed');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');

  const handleViewAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsViewDialogOpen(true);
  };

  const handleEditAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAppointment = (appointment: any) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdate = () => {
    toast.success("Rendez-vous mis à jour avec succès");
    // La fonction useGarageData va automatiquement rafraîchir les données
  };

  const handleDelete = () => {
    toast.success("Rendez-vous supprimé avec succès");
    setIsDeleteDialogOpen(false);
    // La fonction useGarageData va automatiquement rafraîchir les données
  };

  // Safe format date function
  const safeFormatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return "Date invalide";
      }
      return format(date, 'dd/MM/yyyy', { locale: fr });
    } catch (error) {
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
        <Button>
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
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewAppointment(appointment)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditAppointment(appointment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteAppointment(appointment)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {appointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Aucun rendez-vous trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {selectedAppointment && (
        <>
          <ViewAppointmentDialog 
            open={isViewDialogOpen}
            onClose={() => setIsViewDialogOpen(false)}
            appointment={selectedAppointment}
          />
          <EditAppointmentDialog
            open={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            appointment={selectedAppointment}
            onUpdate={handleUpdate}
          />
          <DeleteAppointmentDialog
            open={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            appointment={selectedAppointment}
            onDelete={handleDelete}
          />
        </>
      )}
    </div>
  );
};

export default GarageAppointmentsDashboard;
