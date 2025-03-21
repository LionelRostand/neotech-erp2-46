
import React, { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SalonAppointment } from '../../types/salon-types';
import { Loader2 } from 'lucide-react';
import EditAppointmentDialog from './EditAppointmentDialog';

interface AppointmentsCalendarProps {
  appointments: SalonAppointment[];
  isLoading: boolean;
  onUpdate: (id: string, data: Partial<SalonAppointment>) => Promise<void>;
}

const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({
  appointments,
  isLoading,
  onUpdate
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<SalonAppointment | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Group appointments by date
  const appointmentsByDate = appointments.reduce((acc, appointment) => {
    if (!acc[appointment.date]) {
      acc[appointment.date] = [];
    }
    acc[appointment.date].push(appointment);
    return acc;
  }, {} as Record<string, SalonAppointment[]>);

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

  // Handle appointment click
  const handleAppointmentClick = (appointment: SalonAppointment) => {
    setSelectedAppointment(appointment);
    setEditDialogOpen(true);
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
      <div className="space-y-2 p-2">
        {sortedAppointments.map((appointment) => (
          <div 
            key={appointment.id}
            className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => handleAppointmentClick(appointment)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">{appointment.time}</span>
              <Badge
                className={`
                  ${appointment.status === 'confirmed' ? 'bg-green-500' : ''}
                  ${appointment.status === 'pending' ? 'bg-yellow-500' : ''}
                  ${appointment.status === 'cancelled' ? 'bg-red-500' : ''}
                  ${appointment.status === 'completed' ? 'bg-blue-500' : ''}
                `}
              >
                {appointment.status}
              </Badge>
            </div>
            <div>Client: Client {appointment.clientId}</div>
            <div>Service: {appointment.service}</div>
            <div>Coiffeur: {appointment.stylist}</div>
            <div>Durée: {appointment.duration} min</div>
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
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">
            Rendez-vous du {formatDate(selectedDate)}
          </h3>
          
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            renderAppointments()
          )}
        </CardContent>
      </Card>

      {selectedAppointment && (
        <EditAppointmentDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          appointment={selectedAppointment}
          onUpdateAppointment={onUpdate}
        />
      )}
    </div>
  );
};

export default AppointmentsCalendar;
