
import React from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';

const TodaysAppointments = () => {
  const { appointments = [] } = useGarageData();
  
  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments?.filter(a => a?.date === today) || [];

  if (todaysAppointments.length === 0) {
    return <div className="text-center text-gray-500 py-4">Aucun rendez-vous pour aujourd'hui</div>;
  }

  return (
    <div className="space-y-3">
      {todaysAppointments.slice(0, 5).map((appointment) => (
        <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50">
          <div>
            <p className="font-medium">{appointment.clientName || 'Client'}</p>
            <p className="text-sm text-gray-500">
              {appointment.vehicleMake || ''} {appointment.vehicleModel || ''}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{appointment.time || '10:00'}</p>
            <p className="text-xs text-gray-500">{appointment.service || 'Entretien standard'}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodaysAppointments;
