
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react";

interface AppointmentsStatsProps {
  appointments: any[];
}

const AppointmentsStats = ({ appointments }: AppointmentsStatsProps) => {
  // Helper function to safely format or handle Firebase timestamp objects
  const safeFormatDate = (value: any): string => {
    // Check if the value is a Firebase timestamp object (has seconds and nanoseconds)
    if (value && typeof value === 'object' && 'seconds' in value && 'nanoseconds' in value) {
      // Convert Firebase timestamp to JavaScript Date and then to ISO string
      return new Date(value.seconds * 1000).toISOString().split('T')[0];
    }
    
    // If it's already a string, return it
    if (typeof value === 'string') {
      return value;
    }
    
    // Return empty string for undefined/null
    return '';
  };

  const today = new Date().toISOString().split('T')[0];
  
  // Use safeFormatDate when comparing appointment dates
  const todaysAppointments = appointments.filter(a => safeFormatDate(a.date) === today);
  const upcomingAppointments = appointments.filter(a => safeFormatDate(a.date) > today);
  const completedAppointments = appointments.filter(a => a.status === 'completed');

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Rendez-vous aujourd'hui</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todaysAppointments.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">À venir</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Complétés</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedAppointments.length}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de complétion</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {appointments.length > 0 
              ? Math.round((completedAppointments.length / appointments.length) * 100)
              : 0}%
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsStats;
