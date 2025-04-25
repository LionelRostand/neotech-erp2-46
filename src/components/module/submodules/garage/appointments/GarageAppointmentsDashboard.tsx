
import React from 'react';
import { useGarageData } from '@/hooks/garage/useGarageData';
import AppointmentsTable from './components/AppointmentsTable';

const GarageAppointmentsDashboard = () => {
  const { appointments, isLoading } = useGarageData();

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Chargement...</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Rendez-vous</h1>
      </div>

      <AppointmentsTable appointments={appointments} />
    </div>
  );
};

export default GarageAppointmentsDashboard;
