
import React from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TodaysAppointments = () => {
  const { appointments } = useGarageData();
  
  // Obtenir la date d'aujourd'hui au format ISO (YYYY-MM-DD)
  const today = new Date().toISOString().split('T')[0];
  
  // Filtrer les rendez-vous d'aujourd'hui
  const todaysAppointments = appointments.filter(appointment => {
    // Si la date est au format ISO, on peut comparer directement
    if (appointment?.date === today) return true;
    
    // Si la date est un timestamp ou une date complète, on vérifie juste le jour
    if (appointment?.date) {
      try {
        const appointmentDate = new Date(appointment.date);
        const todayDate = new Date();
        return (
          appointmentDate.getDate() === todayDate.getDate() &&
          appointmentDate.getMonth() === todayDate.getMonth() &&
          appointmentDate.getFullYear() === todayDate.getFullYear()
        );
      } catch (e) {
        console.error("Erreur lors de la conversion de la date:", e);
        return false;
      }
    }
    
    return false;
  });

  if (todaysAppointments.length === 0) {
    return <div className="text-center text-gray-500 py-4">Aucun rendez-vous pour aujourd'hui</div>;
  }

  return (
    <div className="space-y-3">
      {todaysAppointments.slice(0, 5).map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
          <div>
            <p className="font-medium">{appointment.clientName || "Client non spécifié"}</p>
            <p className="text-sm text-gray-500">
              {appointment.vehicleMake || ""} {appointment.vehicleModel || ""}
              {!appointment.vehicleMake && !appointment.vehicleModel && "Véhicule non spécifié"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{appointment.time || format(new Date(), 'HH:mm')}</p>
            <p className="text-xs text-gray-500">{appointment.service || 'Entretien standard'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodaysAppointments;
