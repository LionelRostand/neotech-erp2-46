import React from 'react';
import { Calendar } from "@/components/ui/calendar";

interface AppointmentsCalendarProps {
  appointments: any[];
  isLoading: boolean;
}

const AppointmentsCalendar: React.FC<AppointmentsCalendarProps> = ({
  appointments,
  isLoading
}) => {
  // Helper function to safely format or convert Firebase timestamp objects
  const safeFormatValue = (value: any): string => {
    // Check if the value is a Firebase timestamp object (has seconds and nanoseconds)
    if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
      // Convert Firebase timestamp to JavaScript Date and then to string
      return new Date(value.seconds * 1000).toLocaleDateString();
    }
    
    // Otherwise, just return the value as a string or empty string if undefined
    return String(value || '');
  };

  // Créer un objet pour stocker les dates qui ont des rendez-vous
  const appointmentDates = appointments.reduce((acc, appointment) => {
    if (appointment.date) {
      const dateKey = typeof appointment.date === 'string' 
        ? appointment.date 
        : safeFormatValue(appointment.date);
      
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(appointment);
    }
    return acc;
  }, {});

  if (isLoading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="p-4">
      <Calendar 
        mode="single"
        classNames={{
          day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          day_today: "bg-accent text-accent-foreground",
        }}
      />
      <div className="mt-6">
        <h3 className="font-medium mb-4">Rendez-vous à venir</h3>
        {Object.keys(appointmentDates).length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucun rendez-vous à venir</p>
        ) : (
          <div className="space-y-2">
            {Object.entries(appointmentDates).slice(0, 5).map(([date, dateAppointments]: [string, any]) => (
              <div key={date} className="border rounded-md p-3">
                <div className="font-medium">{date}</div>
                <div className="space-y-1 mt-2">
                  {dateAppointments.map((app: any) => {
                    // Ensure we handle potential timestamp objects in service field
                    const serviceId = typeof app.serviceId === 'object' && 'seconds' in app.serviceId 
                      ? safeFormatValue(app.serviceId)
                      : app.serviceId || 'Service non spécifié';
                    
                    return (
                      <div key={app.id} className="text-sm flex justify-between">
                        <span>{safeFormatValue(app.time)} - {serviceId}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsCalendar;
