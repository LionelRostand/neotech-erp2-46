
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, List, Eye, Pencil, Trash2 } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import CreateAppointmentDialog from './CreateAppointmentDialog';
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';
import AppointmentsCalendar from './AppointmentsCalendar';

// Mock data for appointments 
const mockAppointments = [
  {
    id: '1',
    clientName: 'Jean Dupont',
    date: '2025-05-01',
    time: '09:30',
    service: 'Vidange et changement de filtre',
    status: 'confirmed',
    notes: 'Client régulier, véhicule: Peugeot 308'
  },
  {
    id: '2',
    clientName: 'Marie Laurent',
    date: '2025-05-01',
    time: '11:00',
    service: 'Diagnostic électronique',
    status: 'pending',
    notes: 'Problème de démarrage intermittent'
  },
  {
    id: '3',
    clientName: 'Philippe Martin',
    date: '2025-05-02',
    time: '14:30',
    service: 'Remplacement plaquettes de frein',
    status: 'confirmed',
    notes: 'Bruit lors du freinage'
  },
  {
    id: '4',
    clientName: 'Sophie Bernard',
    date: '2025-05-03',
    time: '10:00',
    service: 'Révision complète',
    status: 'cancelled',
    notes: 'Client a appelé pour annuler'
  },
  {
    id: '5',
    clientName: 'Thomas Petit',
    date: '2025-05-04',
    time: '16:15',
    service: 'Changement pneus',
    status: 'completed',
    notes: 'Pneus hiver à remplacer par pneus été'
  },
];

const GarageAppointmentsDashboard: React.FC = () => {
  const { toast } = useToast();
  // Add the missing state definitions
  const [appointments, setAppointments] = useState(mockAppointments);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const handleCreateAppointment = async (data: any) => {
    try {
      // Mocking the creation of a new appointment
      const newAppointment = {
        id: (appointments.length + 1).toString(),
        status: 'pending',
        ...data
      };
      
      setAppointments([...appointments, newAppointment]);
      setIsCreateDialogOpen(false);
      toast({
        title: "Rendez-vous créé",
        description: "Le rendez-vous a été créé avec succès.",
      });
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de créer le rendez-vous.",
      });
    }
  };

  const handleUpdateAppointment = async (id: string, data: any) => {
    try {
      // Update appointment in the mock data
      const updatedAppointments = appointments.map((appointment) => 
        appointment.id === id ? { ...appointment, ...data } : appointment
      );
      
      setAppointments(updatedAppointments);
      setIsEditDialogOpen(false);
      toast({
        title: "Rendez-vous mis à jour",
        description: "Le rendez-vous a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le rendez-vous.",
      });
    }
  };

  const handleDeleteAppointment = async () => {
    if (!selectedAppointment) return;
    
    try {
      // Remove appointment from the mock data
      const filteredAppointments = appointments.filter(
        (appointment) => appointment.id !== selectedAppointment.id
      );
      
      setAppointments(filteredAppointments);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès.",
      });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous.",
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP', { locale: fr });
    } catch {
      return dateString;
    }
  };

  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'confirmed':
        return <span className="px-2 py-1 rounded-full text-xs bg-green-500 text-white">Confirmé</span>;
      case 'pending':
        return <span className="px-2 py-1 rounded-full text-xs bg-yellow-500 text-white">En attente</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded-full text-xs bg-red-500 text-white">Annulé</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded-full text-xs bg-blue-500 text-white">Terminé</span>;
      default:
        return <span className="px-2 py-1 rounded-full text-xs bg-gray-500 text-white">Inconnu</span>;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Rendez-vous</h1>
        <div className="flex gap-4">
          <div className="inline-flex items-center rounded-md border border-input bg-background p-1 text-muted-foreground">
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                viewMode === 'list' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted hover:text-muted-foreground'
              }`}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4 mr-2" />
              Liste
            </button>
            <button
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                viewMode === 'calendar' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted hover:text-muted-foreground'
              }`}
              onClick={() => setViewMode('calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Calendrier
            </button>
          </div>
          
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau rendez-vous
          </Button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Heure</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{formatDate(appointment.date)}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.service}</TableCell>
                  <TableCell>{renderStatusBadge(appointment.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:bg-red-50"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <AppointmentsCalendar appointments={appointments} />
      )}

      <CreateAppointmentDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateAppointment}
      />
      
      {selectedAppointment && (
        <>
          <ViewAppointmentDialog
            open={isViewDialogOpen}
            onOpenChange={setIsViewDialogOpen}
            appointment={selectedAppointment}
          />
          
          <EditAppointmentDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            appointment={selectedAppointment}
            onUpdate={handleUpdateAppointment}
          />
          
          <DeleteAppointmentDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={handleDeleteAppointment}
          />
        </>
      )}
    </div>
  );
};

export default GarageAppointmentsDashboard;
