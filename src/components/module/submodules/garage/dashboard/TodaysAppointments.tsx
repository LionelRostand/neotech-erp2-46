
import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

// Sample data for today's appointments
const appointments = [
  { 
    id: '1', 
    time: '09:00', 
    client: 'Jean Dupont', 
    vehicle: 'Renault Clio', 
    reason: 'Vidange', 
    status: 'completed' 
  },
  { 
    id: '2', 
    time: '10:30', 
    client: 'Marie Lambert', 
    vehicle: 'Peugeot 208', 
    reason: 'Changement plaquettes', 
    status: 'in_progress' 
  },
  { 
    id: '3', 
    time: '13:45', 
    client: 'Thomas Martin', 
    vehicle: 'Citroen C3', 
    reason: 'Diagnostic', 
    status: 'scheduled' 
  },
  { 
    id: '4', 
    time: '15:15', 
    client: 'Sophie Bernard', 
    vehicle: 'Volkswagen Golf', 
    reason: 'Climatisation', 
    status: 'scheduled' 
  },
  { 
    id: '5', 
    time: '16:30', 
    client: 'Pierre Dubois', 
    vehicle: 'Ford Focus', 
    reason: 'Révision annuelle', 
    status: 'scheduled' 
  },
];

export const TodaysAppointments = () => {
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      default:
        return 'Planifié';
    }
  };

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Aucun rendez-vous pour aujourd'hui
        </div>
      ) : (
        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-2">
          {appointments.map(appointment => (
            <div 
              key={appointment.id} 
              className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-sm font-bold text-gray-600 w-12">
                  {appointment.time}
                </div>
                <div className="space-y-1">
                  <div className="text-sm font-medium">{appointment.client}</div>
                  <div className="text-xs text-gray-500">{appointment.vehicle} - {appointment.reason}</div>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs">
                {getStatusIcon(appointment.status)}
                <span className="whitespace-nowrap">{getStatusText(appointment.status)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
