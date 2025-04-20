
import React from 'react';
import RentalsDashboard from '../vehicle-rentals/RentalsDashboard';
import VehiclesManagement from '../vehicle-rentals/VehiclesManagement';
import ClientsManagement from '../vehicle-rentals/ClientsManagement';
import ReservationsManagement from '../vehicle-rentals/ReservationsManagement';
import LocationsDashboard from '../vehicle-rentals/locations/LocationsDashboard';
import BillingManagement from '../vehicle-rentals/BillingManagement';
import RentalSettingsTab from '../vehicle-rentals/settings/RentalSettingsTab';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';

export const renderVehicleRentalsSubmodule = (submoduleId: string, submodule: any) => {
    switch(submoduleId) {
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
        default:
            return <DefaultSubmoduleContent submodule={submodule} />;
    }
};
