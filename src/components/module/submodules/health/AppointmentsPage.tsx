
import React, { useState } from 'react';
import { Calendar, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useHealthData } from '@/hooks/modules/useHealthData';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useFirestore } from '@/hooks/useFirestore';
import { Appointment } from './types/health-types';

const AppointmentsPage: React.FC = () => {
  const { appointments, patients, doctors, isLoading } = useHealthData();
  const { remove } = useFirestore(COLLECTIONS.HEALTH.APPOINTMENTS);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const handleDeleteAppointment = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      return;
    }
    
    try {
      await remove(id);
      toast.success('Rendez-vous supprimé avec succès');
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error('Erreur lors de la suppression du rendez-vous');
    }
  };

  const todaysAppointments = appointments?.filter(appointment => {
    const today = new Date().toISOString().split('T')[0];
    return appointment.date === today;
  }) || [];

  const upcomingAppointments = appointments?.filter(appointment => {
    const today = new Date().toISOString().split('T')[0];
    return appointment.date > today;
  })
  .sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.time.localeCompare(b.time);
  })
  .slice(0, 5) || [];

  const getPatientName = (patientId: string) => {
    const patient = patients?.find(p => p.id === patientId);
    return patient ? `${patient.firstName} ${patient.lastName}` : 'Inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors?.find(d => d.id === doctorId);
    return doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : 'Inconnu';
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      scheduled: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-yellow-100 text-yellow-800',
    };
    
    const statusLabels = {
      scheduled: 'Planifié',
      completed: 'Terminé',
      cancelled: 'Annulé',
      'no-show': 'Absent',
    };
    
    const statusClass = statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800';
    const statusLabel = statusLabels[status as keyof typeof statusLabels] || status;
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${statusClass}`}>
        {statusLabel}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Rendez-vous
        </h1>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Rendez-vous
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Rendez-vous d'aujourd'hui
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysAppointments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Heure</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Médecin</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todaysAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.time}</TableCell>
                      <TableCell>{getPatientName(appointment.patientId)}</TableCell>
                      <TableCell>{getDoctorName(appointment.doctorId)}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Aucun rendez-vous aujourd'hui
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Prochains rendez-vous
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingAppointments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Médecin</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingAppointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        {new Date(appointment.date).toLocaleDateString()}
                        <div className="text-xs text-gray-500">{appointment.time}</div>
                      </TableCell>
                      <TableCell>{getPatientName(appointment.patientId)}</TableCell>
                      <TableCell>{getDoctorName(appointment.doctorId)}</TableCell>
                      <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Aucun rendez-vous à venir
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les rendez-vous</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments && appointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Heure</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Médecin</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>{new Date(appointment.date).toLocaleDateString()}</TableCell>
                    <TableCell>{appointment.time}</TableCell>
                    <TableCell>{getPatientName(appointment.patientId)}</TableCell>
                    <TableCell>{getDoctorName(appointment.doctorId)}</TableCell>
                    <TableCell>{appointment.reason || 'N/A'}</TableCell>
                    <TableCell>{appointment.duration} min</TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => appointment.id && handleDeleteAppointment(appointment.id)}
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500">Aucun rendez-vous enregistré</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* TODO: Implement appointment dialog component */}
      {showAddDialog && (
        // This will be completed in a future implementation
        <div hidden>
          {setShowAddDialog(false)}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
