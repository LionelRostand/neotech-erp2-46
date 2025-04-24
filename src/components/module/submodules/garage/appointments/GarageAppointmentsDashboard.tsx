
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import { useGarageData } from '@/hooks/garage/useGarageData';
import AppointmentsCalendar from './AppointmentsCalendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import StatCard from '@/components/StatCard';
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';
import { toast } from 'sonner';

const GarageAppointmentsDashboard = () => {
  const { appointments, clients, vehicles, isLoading } = useGarageData();
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [viewAppointment, setViewAppointment] = useState<any>(null);
  const [editAppointment, setEditAppointment] = useState<any>(null);
  const [deleteAppointment, setDeleteAppointment] = useState<any>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  // Filter and count today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);
  
  // Count appointments by status
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const cancelledAppointments = appointments.filter(a => a.status === 'cancelled');

  const handleViewAppointment = (appointment: any) => {
    setViewAppointment(appointment);
  };

  const handleEditAppointment = (appointment: any) => {
    setEditAppointment(appointment);
  };

  const handleDeleteAppointment = (appointment: any) => {
    setDeleteAppointment(appointment);
  };

  const handleUpdateAppointment = async (id: string, data: any) => {
    setIsActionLoading(true);
    try {
      // In a real app, this would update the appointment in Firebase
      // For now, we just simulate a successful update
      console.log('Updating appointment:', id, data);
      toast.success('Rendez-vous mis à jour avec succès');
      setEditAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Erreur lors de la mise à jour du rendez-vous');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsActionLoading(true);
    try {
      // In a real app, this would delete the appointment from Firebase
      // For now, we just simulate a successful deletion
      console.log('Deleting appointment:', deleteAppointment.id);
      toast.success('Rendez-vous supprimé avec succès');
      setDeleteAppointment(null);
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Erreur lors de la suppression du rendez-vous');
    } finally {
      setIsActionLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rendez-vous</h1>
        <Button onClick={() => setShowAddAppointment(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau rendez-vous
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Aujourd'hui"
          value={todayAppointments.length.toString()}
          icon={<Calendar className="h-4 w-4 text-blue-500" />}
          description="Rendez-vous du jour"
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="Confirmés"
          value={confirmedAppointments.length.toString()}
          icon={<Calendar className="h-4 w-4 text-green-500" />}
          description="Rendez-vous confirmés"
          className="bg-green-50 hover:bg-green-100"
        />
        <StatCard
          title="En attente"
          value={pendingAppointments.length.toString()}
          icon={<Calendar className="h-4 w-4 text-yellow-500" />}
          description="Rendez-vous en attente"
          className="bg-yellow-50 hover:bg-yellow-100"
        />
        <StatCard
          title="Annulés"
          value={cancelledAppointments.length.toString()}
          icon={<Calendar className="h-4 w-4 text-red-500" />}
          description="Rendez-vous annulés"
          className="bg-red-50 hover:bg-red-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Calendrier des rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentsCalendar appointments={appointments} />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Rendez-vous à venir</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {appointments.slice(0, 5).map((appointment) => (
                  <div key={appointment.id} className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{appointment.clientName}</h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(appointment.date), 'PPP', { locale: fr })} à {appointment.time}
                        </p>
                      </div>
                      <Badge className={getStatusBadgeColor(appointment.status)}>
                        {getStatusLabel(appointment.status)}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{appointment.service}</p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        Voir
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEditAppointment(appointment)}
                      >
                        Modifier
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteAppointment(appointment)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
                {appointments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    Aucun rendez-vous à venir
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* View Appointment Dialog */}
      {viewAppointment && (
        <ViewAppointmentDialog
          open={!!viewAppointment}
          onOpenChange={(open) => !open && setViewAppointment(null)}
          appointment={viewAppointment}
        />
      )}

      {/* Edit Appointment Dialog */}
      {editAppointment && (
        <EditAppointmentDialog
          open={!!editAppointment}
          onOpenChange={(open) => !open && setEditAppointment(null)}
          appointment={editAppointment}
          onUpdate={handleUpdateAppointment}
          isLoading={isActionLoading}
        />
      )}

      {/* Delete Appointment Dialog */}
      {deleteAppointment && (
        <DeleteAppointmentDialog
          open={!!deleteAppointment}
          onOpenChange={(open) => !open && setDeleteAppointment(null)}
          onConfirm={handleDeleteConfirm}
          appointmentDate={format(new Date(deleteAppointment.date), 'PPP', { locale: fr })}
          isLoading={isActionLoading}
        />
      )}
    </div>
  );
};

export default GarageAppointmentsDashboard;
