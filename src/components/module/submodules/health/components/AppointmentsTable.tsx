
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: Date;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}

const AppointmentsTable: React.FC = () => {
  // Mock appointments data
  const appointments: Appointment[] = [
    {
      id: '1',
      patientName: 'Jean Dupont',
      doctorName: 'Dr. Martin',
      date: new Date(),
      startTime: '09:00',
      endTime: '09:30',
      reason: 'Consultation de routine',
      status: 'confirmed'
    },
    {
      id: '2',
      patientName: 'Marie Lambert',
      doctorName: 'Dr. Bernard',
      date: new Date(),
      startTime: '10:15',
      endTime: '10:45',
      reason: 'Suivi de traitement',
      status: 'scheduled'
    },
    {
      id: '3',
      patientName: 'Philippe Dubois',
      doctorName: 'Dr. Martin',
      date: new Date(),
      startTime: '11:30',
      endTime: '12:00',
      reason: 'Douleurs dorsales',
      status: 'completed'
    },
    {
      id: '4',
      patientName: 'Sophie Moreau',
      doctorName: 'Dr. Klein',
      date: new Date(),
      startTime: '14:00',
      endTime: '14:30',
      reason: 'Renouvellement d\'ordonnance',
      status: 'cancelled'
    },
    {
      id: '5',
      patientName: 'Lucas Petit',
      doctorName: 'Dr. Bernard',
      date: new Date(),
      startTime: '15:45',
      endTime: '16:15',
      reason: 'Première visite',
      status: 'confirmed'
    }
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Planifié';
      case 'confirmed': return 'Confirmé';
      case 'completed': return 'Terminé';
      case 'cancelled': return 'Annulé';
      default: return status;
    }
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left">Patient</th>
            <th className="px-4 py-3 text-left">Médecin</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Horaire</th>
            <th className="px-4 py-3 text-left">Motif</th>
            <th className="px-4 py-3 text-left">Statut</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map(appointment => (
            <tr key={appointment.id} className="border-b hover:bg-muted/50">
              <td className="px-4 py-3">{appointment.patientName}</td>
              <td className="px-4 py-3">{appointment.doctorName}</td>
              <td className="px-4 py-3">
                {format(appointment.date, 'dd/MM/yyyy', { locale: fr })}
              </td>
              <td className="px-4 py-3">
                {appointment.startTime} - {appointment.endTime}
              </td>
              <td className="px-4 py-3">{appointment.reason}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(appointment.status)}`}>
                  {getStatusLabel(appointment.status)}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                    <>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentsTable;
