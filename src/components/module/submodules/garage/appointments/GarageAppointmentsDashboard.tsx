
import React, { useState } from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { format, isValid, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, Edit, Trash2, Calendar } from 'lucide-react';
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
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Liste des Rendez-vous</h1>
          <p className="text-muted-foreground mt-1">
            {appointments.length} rendez-vous au total
          </p>
        </div>
        
        <Button className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Nouveau rendez-vous
        </Button>
      </div>
      
      <div className="grid gap-4">
        {appointments.length === 0 ? (
          <Card className="p-8 text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="font-semibold text-lg mb-2">Aucun rendez-vous</h3>
            <p className="text-muted-foreground">
              Aucun rendez-vous n'a été trouvé. Commencez par en créer un nouveau.
            </p>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{appointment.clientName}</h3>
                    {appointment.status && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {appointment.status}
                      </span>
                    )}
                  </div>
                  <div className="text-muted-foreground space-y-1">
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatAppointmentDate(appointment.date)} à {appointment.time}
                    </p>
                    <p>{appointment.service}</p>
                    {appointment.notes && (
                      <p className="text-sm italic">{appointment.notes}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setViewDialogOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditDialog(appointment)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
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
