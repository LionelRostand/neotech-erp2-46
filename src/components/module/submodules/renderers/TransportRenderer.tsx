
import React from 'react';
import { SubModule } from '@/data/types/modules';
import TransportDashboard from '../transport/TransportDashboard';
import TransportFleet from '../transport/TransportFleet';
import TransportDrivers from '../transport/TransportDrivers';
import TransportReservations from '../transport/TransportReservations';
import TransportPlanning from '../transport/TransportPlanning';
import TransportGeolocation from '../transport/TransportGeolocation';
import TransportPayments from '../transport/TransportPayments';
import TransportCustomerService from '../transport/TransportCustomerService';
import TransportLoyalty from '../transport/TransportLoyalty';
import TransportWebBooking from '../transport/TransportWebBooking';
import TransportSettings from '../transport/TransportSettings';
import ModuleContainer from '../../ModuleContainer';

export const renderTransportSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'transport-dashboard':
      return <TransportDashboard />;
    case 'transport-fleet':
      return (
        <ModuleContainer>
          <TransportFleet />
        </ModuleContainer>
      );
    case 'transport-drivers':
      return (
        <ModuleContainer>
          <TransportDrivers />
        </ModuleContainer>
      );
    case 'transport-reservations':
      return (
        <ModuleContainer>
          <TransportReservations />
        </ModuleContainer>
      );
    case 'transport-planning':
      return (
        <ModuleContainer>
          <TransportPlanning />
        </ModuleContainer>
      );
    case 'transport-geolocation':
      return (
        <ModuleContainer fullWidth noPadding>
          <TransportGeolocation />
        </ModuleContainer>
      );
    case 'transport-payments':
      return (
        <ModuleContainer>
          <TransportPayments />
        </ModuleContainer>
      );
    case 'transport-customer-service':
      return (
        <ModuleContainer>
          <TransportCustomerService />
        </ModuleContainer>
      );
    case 'transport-loyalty':
      return (
        <ModuleContainer>
          <TransportLoyalty />
        </ModuleContainer>
      );
    case 'transport-web-booking':
      return (
        <ModuleContainer fullWidth noPadding>
          <TransportWebBooking />
        </ModuleContainer>
      );
    case 'transport-settings':
      return (
        <ModuleContainer>
          <TransportSettings />
        </ModuleContainer>
      );
    default:
      return <div>Contenu du sous-module non implémenté: {submoduleId}</div>;
  }
};
