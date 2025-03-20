
import React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';

interface AppointmentCalendarProps {
  selectedDate?: Date;
}

interface CalendarAppointment {
  id: string;
  patientName: string;
  doctorName: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
}

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({ selectedDate = new Date() }) => {
  // Generate time slots for the day
  const timeSlots = [];
  for (let hour = 8; hour < 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
  }

  // Mock appointments data
  const appointments: CalendarAppointment[] = [
    {
      id: '1',
      patientName: 'Jean Dupont',
      doctorName: 'Dr. Martin',
      startTime: '09:00',
      endTime: '09:30',
      status: 'confirmed'
    },
    {
      id: '2',
      patientName: 'Marie Lambert',
      doctorName: 'Dr. Bernard',
      startTime: '10:15',
      endTime: '10:45',
      status: 'scheduled'
    },
    {
      id: '3',
      patientName: 'Philippe Dubois',
      doctorName: 'Dr. Martin',
      startTime: '11:30',
      endTime: '12:00',
      status: 'completed'
    },
    {
      id: '4',
      patientName: 'Sophie Moreau',
      doctorName: 'Dr. Klein',
      startTime: '14:00',
      endTime: '14:30',
      status: 'cancelled'
    },
    {
      id: '5',
      patientName: 'Lucas Petit',
      doctorName: 'Dr. Bernard',
      startTime: '15:45',
      endTime: '16:15',
      status: 'confirmed'
    }
  ];

  // Function to get appointment for a given time slot
  const getAppointmentForTimeSlot = (timeSlot: string) => {
    return appointments.find(
      app => app.startTime <= timeSlot && app.endTime > timeSlot
    );
  };

  // Function to get appropriate CSS classes based on appointment status
  const getAppointmentClasses = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'completed':
        return 'bg-gray-100 border-gray-300 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium">
            {format(selectedDate, 'EEEE dd MMMM yyyy', { locale: fr })}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Doctor columns */}
        <div>
          <h4 className="text-sm font-medium mb-2 bg-gray-100 p-2 rounded-md">Dr. Martin</h4>
          <div className="space-y-1">
            {timeSlots.map(timeSlot => {
              const appointment = appointments.find(
                app => app.startTime === timeSlot && app.doctorName === 'Dr. Martin'
              );
              
              return (
                <div 
                  key={`martin-${timeSlot}`}
                  className={`p-2 rounded-md border flex items-start ${
                    appointment 
                      ? getAppointmentClasses(appointment.status) 
                      : 'border-dashed border-gray-200'
                  }`}
                >
                  <Clock className="h-4 w-4 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-medium">{timeSlot}</div>
                    {appointment && (
                      <div className="text-sm mt-1">{appointment.patientName}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2 bg-gray-100 p-2 rounded-md">Dr. Bernard</h4>
          <div className="space-y-1">
            {timeSlots.map(timeSlot => {
              const appointment = appointments.find(
                app => app.startTime === timeSlot && app.doctorName === 'Dr. Bernard'
              );
              
              return (
                <div 
                  key={`bernard-${timeSlot}`}
                  className={`p-2 rounded-md border flex items-start ${
                    appointment 
                      ? getAppointmentClasses(appointment.status) 
                      : 'border-dashed border-gray-200'
                  }`}
                >
                  <Clock className="h-4 w-4 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-medium">{timeSlot}</div>
                    {appointment && (
                      <div className="text-sm mt-1">{appointment.patientName}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium mb-2 bg-gray-100 p-2 rounded-md">Dr. Klein</h4>
          <div className="space-y-1">
            {timeSlots.map(timeSlot => {
              const appointment = appointments.find(
                app => app.startTime === timeSlot && app.doctorName === 'Dr. Klein'
              );
              
              return (
                <div 
                  key={`klein-${timeSlot}`}
                  className={`p-2 rounded-md border flex items-start ${
                    appointment 
                      ? getAppointmentClasses(appointment.status) 
                      : 'border-dashed border-gray-200'
                  }`}
                >
                  <Clock className="h-4 w-4 mr-2 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-medium">{timeSlot}</div>
                    {appointment && (
                      <div className="text-sm mt-1">{appointment.patientName}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCalendar;
