
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Calendar, X, FileText, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment, Patient, Doctor } from '../types/health-types';
import { toast } from 'sonner';

interface AppointmentsTableProps {
  appointments?: Appointment[];
  patients?: Patient[];
  doctors?: Doctor[];
  onView?: (appointment: Appointment) => void;
  onEdit?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onConsultation?: (appointment: Appointment) => void;
}

const AppointmentsTable: React.FC<AppointmentsTableProps> = ({ 
  appointments, 
  patients,
  doctors,
  onView,
  onEdit,
  onCancel,
  onConsultation
}) => {
  // If no appointments are provided, use mock data
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      patientId: '1',
      doctorId: '1',
      date: new Date().toISOString(),
      startTime: '09:00',
      endTime: '09:30',
      status: 'confirmed',
      notes: 'Consultation de routine',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      patientId: '2',
      doctorId: '2',
      date: new Date().toISOString(),
      startTime: '10:15',
      endTime: '10:45',
      status: 'scheduled',
      notes: 'Suivi de traitement',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      patientId: '3',
      doctorId: '1',
      date: new Date().toISOString(),
      startTime: '11:30',
      endTime: '12:00',
      status: 'completed',
      notes: 'Douleurs dorsales',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '4',
      patientId: '4',
      doctorId: '3',
      date: new Date().toISOString(),
      startTime: '14:00',
      endTime: '14:30',
      status: 'cancelled',
      notes: 'Renouvellement d\'ordonnance',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '5',
      patientId: '5',
      doctorId: '2',
      date: new Date().toISOString(),
      startTime: '15:45',
      endTime: '16:15',
      status: 'confirmed',
      notes: 'Première visite',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Mock patients and doctors if none provided
  const mockPatients: Record<string, string> = {
    '1': 'Jean Dupont',
    '2': 'Marie Lambert',
    '3': 'Philippe Dubois',
    '4': 'Sophie Moreau',
    '5': 'Lucas Petit'
  };

  const mockDoctors: Record<string, string> = {
    '1': 'Dr. Martin',
    '2': 'Dr. Bernard',
    '3': 'Dr. Klein'
  };

  const appointmentsData = appointments || mockAppointments;

  // Helper functions
  const getPatientName = (patientId: string) => {
    if (patients) {
      const patient = patients.find(p => p.id === patientId);
      return patient ? `${patient.firstName} ${patient.lastName}` : 'Patient inconnu';
    }
    return mockPatients[patientId] || 'Patient inconnu';
  };

  const getDoctorName = (doctorId: string) => {
    if (doctors) {
      const doctor = doctors.find(d => d.id === doctorId);
      return doctor ? `Dr. ${doctor.lastName}` : 'Médecin inconnu';
    }
    return mockDoctors[doctorId] || 'Médecin inconnu';
  };

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

  // Event handlers with fallbacks
  const handleView = (appointment: Appointment) => {
    if (onView) {
      onView(appointment);
    } else {
      console.log('View appointment:', appointment);
      toast.info(`Voir le rendez-vous de ${getPatientName(appointment.patientId)}`);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    if (onEdit) {
      onEdit(appointment);
    } else {
      console.log('Edit appointment:', appointment);
      toast.info(`Modifier le rendez-vous de ${getPatientName(appointment.patientId)}`);
    }
  };

  const handleCancel = (appointment: Appointment) => {
    if (onCancel) {
      onCancel(appointment);
    } else {
      console.log('Cancel appointment:', appointment);
      toast.info(`Annuler le rendez-vous de ${getPatientName(appointment.patientId)}`);
    }
  };

  const handleConsultation = (appointment: Appointment) => {
    if (onConsultation) {
      onConsultation(appointment);
    } else {
      console.log('Create consultation from appointment:', appointment);
      toast.info(`Créer une consultation pour ${getPatientName(appointment.patientId)}`);
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
          {appointmentsData.map(appointment => (
            <tr key={appointment.id} className="border-b hover:bg-muted/50">
              <td className="px-4 py-3">{getPatientName(appointment.patientId)}</td>
              <td className="px-4 py-3">{getDoctorName(appointment.doctorId)}</td>
              <td className="px-4 py-3">
                {format(new Date(appointment.date), 'dd/MM/yyyy', { locale: fr })}
              </td>
              <td className="px-4 py-3">
                {appointment.startTime} - {appointment.endTime}
              </td>
              <td className="px-4 py-3">{appointment.notes}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(appointment.status)}`}>
                  {getStatusLabel(appointment.status)}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex space-x-1">
                  <Button variant="ghost" size="icon" onClick={() => handleView(appointment)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  
                  {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                    <>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(appointment)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleCancel(appointment)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  
                  {(appointment.status === 'confirmed' || appointment.status === 'completed') && (
                    <Button variant="ghost" size="icon" onClick={() => handleConsultation(appointment)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}

                  {appointment.status === 'confirmed' && (
                    <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleConsultation(appointment)} title="Passer en consultation">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
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
