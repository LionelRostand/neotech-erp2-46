
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

export const FreightRenderer: React.FC<{ submoduleId: string }> = ({ submoduleId }) => {
  switch (submoduleId) {
    case 'freight-dashboard':
      return <FreightDashboard />;
    case 'freight-shipments':
      return <FreightShipments />;
    // SUPPRIMÉ l'ancien case 'freight-routes'
    case 'freight-routes-main':
      return <FreightRoutesPage />; // Nouveau : le vrai composant de gestion de routes, bouton/form inclus
    case 'freight-carriers':
      return <FreightCarriers />;
    case 'freight-tracking':
      return <UnifiedTrackingPage />;
    case 'freight-pricing':
      return <FreightPricing />;
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
