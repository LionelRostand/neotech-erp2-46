
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Scissors, User } from "lucide-react";
import { Appointment } from '../hooks/useSalonStats';
import { Badge } from "@/components/ui/badge";

interface DailyAppointmentsProps {
  appointments: Appointment[];
}

const DailyAppointments: React.FC<DailyAppointmentsProps> = ({ appointments }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Rendez-vous d'aujourd'hui</CardTitle>
        <Calendar className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {appointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun rendez-vous prévu pour aujourd'hui
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex flex-col p-3 rounded-lg border bg-card">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{appointment.clientName}</div>
                      <div className="text-sm text-muted-foreground">{appointment.phone}</div>
                    </div>
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status === 'confirmed' ? 'Confirmé' : 
                     appointment.status === 'pending' ? 'En attente' :
                     appointment.status === 'cancelled' ? 'Annulé' : 'Terminé'}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>{appointment.time} · {appointment.duration} min</span>
                  </div>
                  <div className="flex items-center">
                    <Scissors className="h-3 w-3 mr-1 text-muted-foreground" />
                    <span>{appointment.stylist}</span>
                  </div>
                </div>
                <div className="text-sm font-medium mt-2">{appointment.service}</div>
              </div>
            ))}
            <button className="w-full text-center text-sm text-blue-600 hover:underline mt-2">
              Afficher tous les rendez-vous
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyAppointments;
