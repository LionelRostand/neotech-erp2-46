
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  PlusCircle, 
  CheckCircle2, 
  Filter, 
  Search, 
  Edit, 
  Trash2,
  Eye
} from "lucide-react";
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import AppointmentsCalendar from './AppointmentsCalendar';
import ViewAppointmentDialog from './ViewAppointmentDialog';
import EditAppointmentDialog from './EditAppointmentDialog';
import DeleteAppointmentDialog from './DeleteAppointmentDialog';
import StatCard from '@/components/StatCard';

// Dummy data for demonstration
const appointmentsData = [
  { 
    id: '1', 
    date: '2025-04-25',
    time: '09:30', 
    clientName: 'Jean Dupont',
    service: 'Révision complète',
    status: 'scheduled',
    vehicle: 'Peugeot 308'
  },
  { 
    id: '2', 
    date: '2025-04-25',
    time: '14:00', 
    clientName: 'Marie Martin',
    service: 'Changement de pneus',
    status: 'completed',
    vehicle: 'Renault Clio'
  },
  { 
    id: '3', 
    date: '2025-04-26',
    time: '10:15', 
    clientName: 'Philippe Dubois',
    service: 'Diagnostic électronique',
    status: 'scheduled',
    vehicle: 'Citroën C3'
  },
  { 
    id: '4', 
    date: '2025-04-26',
    time: '16:30', 
    clientName: 'Sophie Laurent',
    service: 'Vidange',
    status: 'scheduled',
    vehicle: 'Volkswagen Golf'
  },
  { 
    id: '5', 
    date: '2025-04-27',
    time: '11:00', 
    clientName: 'Thomas Bernard',
    service: 'Contrôle technique préparatoire',
    status: 'scheduled',
    vehicle: 'BMW Série 3'
  }
];

const GarageAppointmentsDashboard = () => {
  const [appointments, setAppointments] = useState(appointmentsData);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleView = (appointment: any) => {
    setSelectedAppointment(appointment);
    setViewDialogOpen(true);
  };

  const handleEdit = (appointment: any) => {
    setSelectedAppointment(appointment);
    setEditDialogOpen(true);
  };

  const handleDelete = (appointment: any) => {
    setSelectedAppointment(appointment);
    setDeleteDialogOpen(true);
  };

  const handleUpdate = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? { ...appointment, ...data } : appointment
        )
      );
      
      toast({
        title: "Rendez-vous mis à jour",
        description: "Le rendez-vous a été mis à jour avec succès.",
      });
      
      setEditDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du rendez-vous.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAppointments(prev => 
        prev.filter(appointment => appointment.id !== selectedAppointment.id)
      );
      
      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès.",
      });
      
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression du rendez-vous.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to safely format dates
  const formatAppointmentDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isValid(date)) {
        return format(date, 'dd MMM yyyy', { locale: fr });
      }
      return dateString; // Return original string if not valid date
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Date invalide';
    }
  };

  const scheduledAppointments = appointments.filter(a => a.status === 'scheduled');
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  // Get today's date and find appointments for today
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(a => a.date === today);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Rendez-vous aujourd'hui"
          value={todayAppointments.length.toString()}
          description="Planifiés ce jour"
          icon={<Calendar className="h-4 w-4 text-blue-500" />}
          className="bg-blue-50 hover:bg-blue-100"
        />
        <StatCard
          title="Rendez-vous à venir"
          value={scheduledAppointments.length.toString()}
          description="En attente"
          icon={<Clock className="h-4 w-4 text-purple-500" />}
          className="bg-purple-50 hover:bg-purple-100"
        />
        <StatCard
          title="Rendez-vous terminés"
          value={completedAppointments.length.toString()}
          description="Services réalisés"
          icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
          className="bg-green-50 hover:bg-green-100"
        />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <h2 className="text-2xl font-bold">Gestion des Rendez-vous</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau Rendez-vous
          </Button>
        </div>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="list">Liste</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Liste des Rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left">Date</th>
                      <th className="px-4 py-2 text-left">Heure</th>
                      <th className="px-4 py-2 text-left">Client</th>
                      <th className="px-4 py-2 text-left">Véhicule</th>
                      <th className="px-4 py-2 text-left">Service</th>
                      <th className="px-4 py-2 text-left">Statut</th>
                      <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td className="px-4 py-2">{formatAppointmentDate(appointment.date)}</td>
                        <td className="px-4 py-2">{appointment.time}</td>
                        <td className="px-4 py-2">{appointment.clientName}</td>
                        <td className="px-4 py-2">{appointment.vehicle}</td>
                        <td className="px-4 py-2">{appointment.service}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {appointment.status === 'scheduled' ? 'Planifié' : 'Terminé'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <Button onClick={() => handleView(appointment)} size="sm" variant="ghost">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => handleEdit(appointment)} size="sm" variant="ghost">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button onClick={() => handleDelete(appointment)} size="sm" variant="ghost" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendrier des Rendez-vous</CardTitle>
            </CardHeader>
            <CardContent>
              <AppointmentsCalendar appointments={appointments} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
            onUpdate={handleUpdate}
            isLoading={isLoading}
          />
          
          <DeleteAppointmentDialog 
            open={deleteDialogOpen} 
            onOpenChange={setDeleteDialogOpen} 
            appointmentInfo={`${selectedAppointment.service} pour ${selectedAppointment.clientName}`}
            onConfirm={handleConfirmDelete}
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
};

export default GarageAppointmentsDashboard;
