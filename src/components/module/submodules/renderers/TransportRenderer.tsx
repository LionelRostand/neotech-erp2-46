
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import { SubModule } from '@/data/types/modules';
import TransportDashboard from '../transport/TransportDashboard';
import TransportFleet from '../transport/TransportFleet';
import TransportReservations from '../transport/TransportReservations';
import TransportDrivers from '../transport/TransportDrivers';
import TransportGeolocation from '../transport/TransportGeolocation';
import TransportPlanning from '../transport/TransportPlanning';
import TransportPayments from '../transport/TransportPayments';
import TransportCustomerService from '../transport/TransportCustomerService';

export const renderTransportSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'transport-dashboard':
      return <TransportDashboard />;
    case 'transport-fleet':
      return <TransportFleet />;
    case 'transport-reservations':
      return <TransportReservations />;
    case 'transport-drivers':
      return <TransportDrivers />;
    case 'transport-geolocation':
      return <TransportGeolocation />;
    case 'transport-planning':
      return <TransportPlanning />;
    case 'transport-payments':
      return <TransportPayments />;
    case 'transport-customer-service':
      return <TransportCustomerService />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
