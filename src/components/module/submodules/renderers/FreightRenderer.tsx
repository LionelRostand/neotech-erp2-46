
import React from 'react';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import FreightDashboard from '../FreightDashboard';
import FreightShipments from '../FreightShipments';
import FreightPackages from '../freight/FreightPackages';
import FreightTracking from '../freight/FreightTracking';
import { SubModule } from '@/data/types/modules';
import FreightContainers from '../freight/FreightContainers';
import FreightCarriers from '../freight/FreightCarriers';
import FreightPricing from '../freight/FreightPricing';
import FreightDocuments from '../freight/FreightDocuments';
import FreightClientPortal from '../freight/FreightClientPortal';
import FreightSettings from '../freight/FreightSettings';

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
    case 'freight-containers':
      return <FreightContainers />;
    case 'freight-carriers':
      return <FreightCarriers />;
    case 'freight-pricing':
      return <FreightPricing />;
    case 'freight-documents':
      return <FreightDocuments />;
    case 'freight-client-portal':
      return <FreightClientPortal />;
    case 'freight-settings':
      return <FreightSettings />;
    // All other freight submodules will default to DefaultSubmoduleContent
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
