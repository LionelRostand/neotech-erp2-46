
import React from 'react';
import { SubModule } from '@/data/types/modules';
import TransportDashboard from '../transport/TransportDashboard';
import TransportReservations from '../transport/TransportReservations';
import TransportDrivers from '../transport/TransportDrivers';
import TransportFleet from '../transport/TransportFleet';
import TransportPlanning from '../transport/TransportPlanning';
import TransportGeolocation from '../transport/TransportGeolocation';
import TransportPayments from '../transport/TransportPayments';
import TransportLoyalty from '../transport/TransportLoyalty';
import TransportWebBooking from '../transport/TransportWebBooking';
import TransportSettings from '../transport/TransportSettings';

export const renderTransportSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('renderTransportSubmodule called with:', submoduleId);
  
  switch (submoduleId) {
    case 'transport-dashboard':
      return <TransportDashboard />;
    case 'transport-reservations':
      return <TransportReservations />;
    case 'transport-planning':
      return <TransportPlanning />;
    case 'transport-fleet':
      return <TransportFleet />;
    case 'transport-drivers':
      return <TransportDrivers />;
    case 'transport-geolocation':
      return <TransportGeolocation />;
    case 'transport-payments':
      return <TransportPayments />;
    case 'transport-loyalty':
      return <TransportLoyalty />;
    case 'transport-web-booking':
      return <TransportWebBooking />;
    case 'transport-settings':
      return <TransportSettings />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
