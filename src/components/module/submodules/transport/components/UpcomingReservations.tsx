
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck } from "lucide-react";

interface UpcomingReservationsProps {
  todayReservations: number;
  upcomingReservations: number;
}

const UpcomingReservations: React.FC<UpcomingReservationsProps> = ({ 
  todayReservations, 
  upcomingReservations 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <CalendarCheck className="h-5 w-5" />
            <span>Réservations à venir</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">Aujourd'hui</p>
              <p className="text-2xl font-bold text-blue-600">{todayReservations}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-gray-500">À venir</p>
              <p className="text-2xl font-bold text-purple-600">{upcomingReservations}</p>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-4">
            <p>Prochaine: <span className="font-medium text-gray-700">15:30 - Transfert Aéroport</span></p>
            <p>Client: <span className="font-medium text-gray-700">Jean Dupont</span></p>
            <p>Chauffeur: <span className="font-medium text-gray-700">Marc Leblanc</span></p>
          </div>
          <button className="w-full mt-2 text-blue-600 text-sm font-medium hover:underline">
            Voir toutes les réservations
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingReservations;
