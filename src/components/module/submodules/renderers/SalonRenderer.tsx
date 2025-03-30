
import React from 'react';
import { SubModule } from '@/data/types/modules';
import SalonDashboard from '../salon/dashboard/SalonDashboard';
import SalonAppointments from '../salon/appointments/SalonAppointments';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';

interface SalonRendererProps {
  submoduleId: string;
  submodule: SubModule;
}

export const SalonRenderer: React.FC<SalonRendererProps> = ({ submoduleId, submodule }) => {
  switch (submoduleId) {
    case 'salon-dashboard':
      return <SalonDashboard />;
    case 'salon-appointments':
      return <SalonAppointments />;
    default:
      return <DefaultSubmoduleContent title={submodule.name} submodule={submodule} />;
  }
};
