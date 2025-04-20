
import React from 'react';
import { SubModule } from '@/data/types/modules';
import RentalsDashboard from '../vehicle-rentals/RentalsDashboard';
import VehiclesManagement from '../vehicle-rentals/VehiclesManagement';
import ClientsManagement from '../vehicle-rentals/ClientsManagement';
import ReservationsManagement from '../vehicle-rentals/ReservationsManagement';
import LocationsDashboard from '../vehicle-rentals/locations/LocationsDashboard';
import BillingManagement from '../vehicle-rentals/BillingManagement';
import RentalSettingsTab from '../vehicle-rentals/settings/RentalSettingsTab';
import ReportsManagement from '../vehicle-rentals/ReportsManagement';

export const renderVehicleRentalsSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('VehicleRentalsRenderer - Rendering submodule:', submoduleId);
  
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
      return <LocationsDashboard />;
    case 'rentals-billing':
      return <BillingManagement />;
    case 'rentals-settings':
      return <RentalSettingsTab />;
    case 'rentals-reports':
      return <ReportsManagement />;
    default:
      console.warn(`No renderer found for vehicle rentals submodule: ${submoduleId}`);
      return (
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{submodule.name}</h2>
          <p className="text-muted-foreground">Cette fonctionnalité est en cours de développement.</p>
        </div>
      );
  }
};
