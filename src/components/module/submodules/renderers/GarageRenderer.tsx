
import React from 'react';
import { SubModule } from "@/data/types/modules";
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import GarageDashboard from '../garage/GarageDashboard';
import GarageClientsDashboard from '../garage/clients/GarageClientsDashboard';
import GarageVehiclesDashboard from '../garage/vehicles/GarageVehiclesDashboard';

export const renderGarageSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('Rendering garage submodule:', submoduleId);
  
  switch (submoduleId) {
    case 'garage-dashboard':
      return <GarageDashboard />;
    case 'garage-clients':
      return <GarageClientsDashboard />;
    case 'garage-vehicles':
      return <GarageVehiclesDashboard />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
