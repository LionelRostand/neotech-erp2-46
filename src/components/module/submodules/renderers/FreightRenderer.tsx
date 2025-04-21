
import React from 'react';
import FreightDashboard from '../freight/FreightDashboard';
import FreightShipmentsPage from '../freight/shipments/FreightShipmentsPage';
import FreightClientPortal from '../freight/FreightClientPortal';
import FreightDocuments from '../freight/FreightDocuments';
import FreightRoutes from '../freight/FreightRoutes';
import FreightSettings from '../freight/FreightSettings';
import FreightTrackingPage from '../freight/tracking/FreightTrackingPage';
import FreightPaymentsPage from '../freight/pricing/FreightPaymentsPage';

interface FreightRendererProps {
  submoduleId: string;
}

export const FreightRenderer: React.FC<FreightRendererProps> = ({ submoduleId }) => {
  switch (submoduleId) {
    case 'freight-dashboard':
      return <FreightDashboard />;
    case 'freight-shipments':
      return <FreightShipmentsPage />;
    case 'freight-routes':
      return <FreightRoutes />;
    case 'freight-tracking':
      return <FreightTrackingPage />;
    case 'freight-pricing':
      return <FreightPaymentsPage />;
    case 'freight-documents':
      return <FreightDocuments />;
    case 'freight-client-portal':
      return <FreightClientPortal />;
    case 'freight-settings':
      return <FreightSettings />;
    default:
      return <div>Module {submoduleId} en cours de développement</div>;
  }
};
