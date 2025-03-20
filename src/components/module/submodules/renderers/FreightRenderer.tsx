
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import FreightDashboard from '../FreightDashboard';
import FreightShipments from '../FreightShipments';
import FreightPackages from '../freight/FreightPackages';
import FreightTracking from '../freight/FreightTracking';
import { SubModule } from '@/data/types/modules';

export const renderFreightSubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'freight-dashboard':
      return <FreightDashboard />;
    case 'freight-shipments':
      return <FreightShipments />;
    case 'freight-packages':
      return <FreightPackages />;
    case 'freight-tracking':
      return <FreightTracking />;
    // All other freight submodules will default to DefaultSubmoduleContent
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
