
import React from 'react';
import { 
  startOfDay, 
  endOfDay, 
  eachHourOfInterval, 
  format,
  addHours,
  set
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';

interface AppointmentType {
  id: number;
  patient: string;
  time: string;
  date: string;
  duration: number;
  doctor: string;
  type: string;
  status: string;
}

interface AppointmentCalendarProps {
  selectedDate?: Date;
}

// Données de démonstration
const appointments: AppointmentType[] = [
  { 
    id: 1, 
    patient: 'Martin Dupont', 
    time: '09:30', 
    date: '2023-07-15', 
    duration: 30,
    doctor: 'Dr. Laurent', 
    type: 'Consultation',
    status: 'scheduled' 
  },
  { 
    id: 2, 
    patient: 'Sophie Durand', 
    time: '10:15', 
    date: '2023-07-15', 
    duration: 45,
    doctor: 'Dr. Moreau', 
    type: 'Suivi',
    status: 'confirmed' 
  },
  { 
    id: 3, 
    patient: 'Philippe Martin', 
    time: '11:00', 
    date: '2023-07-15', 
    duration: 60,
    doctor: 'Dr. Petit', 
    type: 'Urgence',
    status: 'in-progress' 
  },
  { 
    id: 4, 
    patient: 'Claire Fontaine', 
    time: '14:30', 
    date: '2023-07-15', 
    duration: 30,
    doctor: 'Dr. Laurent', 
    type: 'Consultation',
    status: 'scheduled' 
  },
];

const doctors = [
  'Dr. Laurent',
  'Dr. Moreau',
  'Dr. Petit',
];

// Fonction pour obtenir les rendez-vous d'un médecin à une heure donnée
const getAppointmentsForDoctorAtHour = (doctor: string, hour: Date, appointments: AppointmentType[]) => {
  const formattedHour = format(hour, 'HH:mm');
  return appointments.filter(appointment => {
    const appointmentHour = appointment.time;
    return appointment.doctor === doctor && 
           appointmentHour >= formattedHour && 
           appointmentHour < format(addHours(hour, 1), 'HH:mm');
  });
};

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ selectedDate = new Date() }) => {
  // Définir la plage d'heures pour la journée (8h à 19h)
  const startHour = set(startOfDay(selectedDate), { hours: 8 });
  const endHour = set(endOfDay(selectedDate), { hours: 19 });
  const hours = eachHourOfInterval({ start: startHour, end: endHour });

  // Obtenir le style de couleur en fonction du statut du rendez-vous
  const getAppointmentStyle = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 border-blue-400 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 border-green-400 text-green-800';
      case 'in-progress':
        return 'bg-amber-100 border-amber-400 text-amber-800';
      case 'completed':
        return 'bg-gray-100 border-gray-400 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 border-red-400 text-red-800';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-xl font-medium mb-4">
        {format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr })}
      </div>
      
      <div className="grid grid-cols-[4rem_repeat(3,1fr)] gap-1">
        {/* En-tête avec les noms des médecins */}
        <div className="h-10"></div>
        {doctors.map(doctor => (
          <div key={doctor} className="h-10 flex items-center justify-center font-semibold bg-muted rounded-md px-2">
            {doctor}
          </div>
        ))}
        
        {/* Grille des heures */}
        {hours.map(hour => (
          <React.Fragment key={hour.toString()}>
            {/* Colonne des heures */}
            <div className="flex items-center justify-center h-24 font-medium text-sm text-muted-foreground">
              {format(hour, 'HH:mm')}
            </div>
            
            {/* Colonnes des médecins */}
            {doctors.map(doctor => {
              const doctorAppointments = getAppointmentsForDoctorAtHour(doctor, hour, appointments);
              
              return (
                <div key={`${doctor}-${hour}`} className="h-24 border border-dashed border-muted rounded-md p-1">
                  {doctorAppointments.map(appointment => (
                    <div 
                      key={appointment.id}
                      className={`text-xs p-1 border rounded-md mb-1 cursor-pointer ${getAppointmentStyle(appointment.status)}`}
                    >
                      <div className="font-semibold">{appointment.time} - {appointment.patient}</div>
                      <div>{appointment.type}</div>
                    </div>
                  ))}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default AppointmentCalendar;
