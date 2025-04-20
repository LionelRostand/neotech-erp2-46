
import React from 'react';
import { SubModule } from '@/data/types/modules';
import RentalsDashboard from '../vehicle-rentals/RentalsDashboard';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';

export const renderVehicleRentalsSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'rentals-dashboard':
      return <RentalsDashboard />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
