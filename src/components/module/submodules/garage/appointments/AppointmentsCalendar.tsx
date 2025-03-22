
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Appointment } from '../types/garage-types';
import { Car, Clock, User, Wrench } from 'lucide-react';

interface AppointmentsCalendarProps {
  appointments: Appointment[];
  mechanicsMap: Record<string, string>;
  clientsMap: Record<string, string>;
  vehiclesMap: Record<string, string>;
  onSelectAppointment: (appointment: Appointment) => void;
}

const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({
  appointments,
  mechanicsMap,
  clientsMap,
  vehiclesMap,
  onSelectAppointment
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {} as Record<string, Appointment[]>);

  // Get appointments for the selected date
  const getSelectedDateAppointments = () => {
    if (!selectedDate) return [];
    
    const dateStr = selectedDate.toISOString().split('T')[0];
    return appointmentsByDate[dateStr] || [];
  };

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Planifié</Badge>;
      case 'in_progress':
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">En cours</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Terminé</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Annulé</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>;
    }
  };

  // Render appointments for selected date
  const renderAppointments = () => {
    const dateAppointments = getSelectedDateAppointments();
    
    if (dateAppointments.length === 0) {
      return (
        <div className="p-4 text-center text-muted-foreground">
          Aucun rendez-vous pour cette date
        </div>
      );
    }

    // Sort appointments by time
    const sortedAppointments = [...dateAppointments].sort((a, b) => {
      return a.time.localeCompare(b.time);
    });

    return (
      <div className="space-y-3">
        {sortedAppointments.map((appointment) => (
          <div 
            key={appointment.id}
            className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => onSelectAppointment(appointment)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{appointment.time}</span>
              {getStatusBadge(appointment.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{clientsMap[appointment.clientId] || appointment.clientId}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Car className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{vehiclesMap[appointment.vehicleId] || appointment.vehicleId}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Wrench className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{appointment.reason}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{appointment.duration} min</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-auto">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border"
        />
      </div>
      
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle>Rendez-vous du {formatDate(selectedDate)}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderAppointments()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsCalendar;
