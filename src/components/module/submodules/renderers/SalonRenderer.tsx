
import React from 'react';
import { SubModule } from '@/data/types/modules';
import SalonDashboard from '../salon/dashboard/SalonDashboard';
import SalonAppointments from '../salon/appointments/SalonAppointments';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';

export const renderSalonSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'salon-dashboard':
      return <SalonDashboard />;
    case 'salon-appointments':
      return <SalonAppointments />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
