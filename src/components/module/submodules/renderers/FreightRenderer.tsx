
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
import FreightShipmentsPage from '../freight/FreightShipmentsPage';
import FreightRoutesPage from '../freight/FreightRoutesPage';

export const renderFreightSubmodule = (submoduleId: string, submodule: SubModule) => {
  console.log(`Rendering freight submodule: ${submoduleId}`);
  
  switch (submoduleId) {
    case 'freight-dashboard':
      return <FreightDashboard />;
    case 'freight-shipments':
      return <FreightShipmentsPage />;
    case 'freight-routes':
      return <FreightRoutesPage />;
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
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
