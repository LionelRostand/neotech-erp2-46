
import React from 'react';
import { SubModule } from '@/data/types/modules';
import GarageDashboard from '../garage/GarageDashboard';
import GarageRepairs from '../garage/repairs/GarageRepairs';
import GarageMechanicsDashboard from '../garage/mechanics/GarageMechanicsDashboard';

export const renderGarageSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log('GarageRenderer - Rendering submodule:', submoduleId);

  switch (submoduleId) {
    case 'garage-dashboard':
      return <GarageDashboard />;
    case 'garage-repairs':
      return <GarageRepairs />;
    case 'garage-mechanics':
      return <GarageMechanicsDashboard />;
    // Add more cases here as you implement more garage submodules
    default:
      return (
        <div className="container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">{submodule.name}</h2>
          <p>Cette section est en cours de développement.</p>
        </div>
      );
  }
};
