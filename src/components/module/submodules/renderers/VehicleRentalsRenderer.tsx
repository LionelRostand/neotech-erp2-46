
import React from 'react';
import { SubModule } from '@/data/types/modules';
import RentalsDashboard from '../vehicle-rentals/RentalsDashboard';
import VehiclesManagement from '../vehicle-rentals/VehiclesManagement';
import ClientsManagement from '../vehicle-rentals/ClientsManagement';
import ReservationsManagement from '../vehicle-rentals/ReservationsManagement';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';

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
    default:
      return <DefaultSubmoduleContent title={submodule.name} submodule={submodule} />;
  }
};
