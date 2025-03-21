
import React from 'react';
import { SubModule } from '@/data/types/modules';
import RentalsDashboard from '../vehicle-rentals/RentalsDashboard';
import VehiclesManagement from '../vehicle-rentals/VehiclesManagement';
import ClientsManagement from '../vehicle-rentals/ClientsManagement';
import ReservationsManagement from '../vehicle-rentals/ReservationsManagement';
import LocationsManagement from '../vehicle-rentals/LocationsManagement';
import BillingManagement from '../vehicle-rentals/BillingManagement';
import ReportsManagement from '../vehicle-rentals/ReportsManagement';
import SettingsManagement from '../vehicle-rentals/SettingsManagement';

export const renderVehicleRentalsSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'rentals-dashboard':
      return <RentalsDashboard />;
    case 'rentals-vehicles':
      return <VehiclesManagement />;
    case 'rentals-clients':
      return <ClientsManagement />;
    case 'rentals-reservations':
      return <ReservationsManagement />;
    case 'rentals-locations':
      return <LocationsManagement />;
    case 'rentals-billing':
      return <BillingManagement />;
    case 'rentals-reports':
      return <ReportsManagement />;
    case 'rentals-settings':
      return <SettingsManagement />;
    default:
      return <div>Contenu du sous-module non implémenté: {submoduleId}</div>;
  }
};
