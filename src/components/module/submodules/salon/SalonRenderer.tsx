
import React from 'react';
import { useParams } from 'react-router-dom';
import SalonDashboard from './dashboard/SalonDashboard';
import SalonClients from './clients/SalonClients';
import SalonAppointments from './appointments/SalonAppointments';

const SalonRenderer = () => {
  const { submodule } = useParams<{ submodule: string }>();
  
  console.log('SalonRenderer: rendering submodule', submodule);

  // Render the appropriate submodule based on the URL parameter
  switch (submodule) {
    case 'dashboard':
      return <SalonDashboard />;
    case 'clients':
      return <SalonClients />;
    case 'appointments':
      return <SalonAppointments />;
    default:
      // Fallback to dashboard if no matching submodule
      console.warn(`Unknown submodule: ${submodule}, falling back to dashboard`);
      return <SalonDashboard />;
  }
};

export default SalonRenderer;
