
import React from 'react';
import RentalsDashboard from '../vehicle-rentals/RentalsDashboard';
import VehiclesManagement from '../vehicle-rentals/VehiclesManagement';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent'; // Corrected import path

export const renderVehicleRentalsSubmodule = (submoduleId: string, submodule: any) => {
    switch(submoduleId){
        case 'rentals-dashboard':
            return <RentalsDashboard />;
        case 'rentals-vehicles':
            return <VehiclesManagement />;
        default:
            return <DefaultSubmoduleContent submodule={submodule} />;
    }
};
