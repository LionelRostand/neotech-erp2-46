
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';
import { toast } from 'sonner';

const GarageAppointmentsDashboard = () => {
  const { appointments, isLoading } = useGarageData();
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatAppointmentDate = (dateString: string) => {
    if (!dateString) return 'Date non spécifiée';
    
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) {
        return 'Date invalide';
      }
      return format(date, 'PPP', { locale: fr });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    // Implement update logic later
    toast.success('Rendez-vous mis à jour');
    setEditDialogOpen(false);
  };

  const handleDelete = async () => {
    // Implement delete logic later
    toast.success('Rendez-vous supprimé');
    setDeleteDialogOpen(false);
  };

  const handleOpenEditDialog = (appointment: any) => {
    setSelectedAppointment(appointment);
    setEditDialogOpen(true);
  };

  if (isLoading) {
    return <div>Chargement des rendez-vous...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Liste des Rendez-vous</h1>
      
      <div className="grid gap-4">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{appointment.clientName}</h3>
                <p className="text-sm text-gray-600">
                  {formatAppointmentDate(appointment.date)} - {appointment.time}
                </p>
                <p className="text-sm">{appointment.service}</p>
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setViewDialogOpen(true);
                  }}
                >
                  Voir
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleOpenEditDialog(appointment)}
                >
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setDeleteDialogOpen(true);
                  }}
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ViewAppointmentDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        appointment={selectedAppointment}
      />

      <EditAppointmentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        appointment={selectedAppointment}
        onUpdate={handleUpdate}
        isLoading={false}
      />

      <DeleteAppointmentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        appointmentInfo={selectedAppointment ? `${selectedAppointment.clientName} - ${formatAppointmentDate(selectedAppointment.date)}` : ''}
        isLoading={false}
      />
    </div>
  );
};

export default GarageAppointmentsDashboard;
