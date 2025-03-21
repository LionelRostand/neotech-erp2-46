
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Appointment } from '../hooks/useSalonStats';

interface UpcomingAppointmentsProps {
  todayAppointments: Appointment[];
  upcomingAppointments: Appointment[];
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ 
  todayAppointments, 
  upcomingAppointments 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Rendez-vous à venir</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Aujourd'hui</p>
              <p className="text-2xl font-bold text-blue-600">{todayAppointments.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">À venir</p>
              <p className="text-2xl font-bold text-purple-600">{upcomingAppointments.length}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-4">
            <p className="font-medium text-gray-700 mb-2">Prochains rendez-vous:</p>
            {todayAppointments.slice(0, 2).map(app => (
              <div key={app.id} className="mb-2 border-b pb-2">
                <p className="text-gray-700"><span className="font-semibold">{app.date}</span> - {app.clientName}</p>
                <p className="text-xs text-gray-500">
                  {app.service} • {app.stylist} • {app.duration} min
                </p>
              </div>
            ))}
            {upcomingAppointments.slice(0, 1).map(app => (
              <div key={app.id} className="mb-2">
                <p className="text-gray-700"><span className="font-semibold">{app.date}</span> - {app.clientName}</p>
                <p className="text-xs text-gray-500">
                  {app.service} • {app.stylist} • {app.duration} min
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-2 text-blue-600 text-sm font-medium hover:underline">
            Voir tous les rendez-vous
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;
