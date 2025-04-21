import React from 'react';
import FreightDashboard from '../freight/FreightDashboard';
import FreightShipments from '../FreightShipments';
import FreightRoutes from '../freight/FreightRoutes';
import FreightCarriers from '../freight/carriers/FreightCarriersList';
import FreightDocuments from '../freight/FreightDocuments';
import FreightPricing from '../freight/FreightPricing';
import FreightSettings from '../freight/FreightSettings';
import FreightClientPortal from '../freight/FreightClientPortal';
import UnifiedTrackingPage from '../freight/tracking/UnifiedTrackingPage';
import FreightRoutesPage from '../freight/FreightRoutesPage';
import FreightAccountingPage from '../freight/FreightAccountingPage';

export const FreightRenderer: React.FC<{ submoduleId: string }> = ({ submoduleId }) => {
  switch (submoduleId) {
    case 'freight-dashboard':
      return <FreightDashboard />;
    case 'freight-shipments':
      return <FreightShipments />;
    case 'freight-accounting': // Renvoie le nouveau composant pour la compta
      return <FreightAccountingPage />;
    case 'freight-routes-main':
      return <FreightRoutesPage />;
    case 'freight-carriers':
      return <FreightCarriers />;
    case 'freight-tracking':
      return <UnifiedTrackingPage />;
    case 'freight-documents':
      return <FreightDocuments />;
    case 'freight-client-portal':
      return <FreightClientPortal />;
    case 'freight-settings':
      return <FreightSettings />;
    default:
      return <div>Submodule {submoduleId} not found in FreightRenderer</div>;
  }
};
export default FreightRenderer;
