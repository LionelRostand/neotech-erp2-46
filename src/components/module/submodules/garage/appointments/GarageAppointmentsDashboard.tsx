import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Clock, CheckCircle, Eye, Pencil, Trash2 } from "lucide-react";
import { useGarageData } from '@/hooks/garage/useGarageData';
import CreateAppointmentDialog from './CreateAppointmentDialog';
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const GarageAppointmentsDashboard = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { appointments, vehicles, clients, isLoading: isLoadingData } = useGarageData();
  const { update, remove } = useFirestore(COLLECTIONS.GARAGE.APPOINTMENTS);

  if (isLoadingData) {
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

  const handleUpdate = async (id: string, updatedData: any) => {
    setIsLoading(true);
    try {
      await update(id, updatedData);
      toast.success("Rendez-vous mis à jour avec succès");
      setShowEditDialog(false);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error("Erreur lors de la mise à jour du rendez-vous");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedAppointment) return;
    
    setIsLoading(true);
    try {
      await remove(selectedAppointment.id);
      toast.success("Rendez-vous supprimé avec succès");
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error("Erreur lors de la suppression du rendez-vous");
    } finally {
      setIsLoading(false);
    }
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
          <CardTitle>Liste des Rendez-vous</CardTitle>
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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>
                    {format(new Date(appointment.date), 'PPP', { locale: fr })}
                  </TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>
                    {vehicles.find(v => v.id === appointment.vehicleId)?.licensePlate || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
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
      />

      {selectedAppointment && (
        <>
          <ViewAppointmentDialog
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
            appointment={selectedAppointment}
          />
          
          <EditAppointmentDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            appointment={selectedAppointment}
            onUpdate={handleUpdate}
            isLoading={isLoading}
          />
          
          <DeleteAppointmentDialog
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onConfirm={handleDeleteConfirm}
            appointmentDate={format(new Date(selectedAppointment.date), 'PPP', { locale: fr })}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default GarageAppointmentsDashboard;
