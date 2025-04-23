
import React from 'react';
import FreightDashboard from '../freight/FreightDashboard';
import FreightShipmentsPage from '../freight/FreightShipmentsPage';
import FreightRoutes from '../freight/FreightRoutes';
import FreightCarriers from '../freight/carriers/FreightCarriersList';
import FreightDocuments from '../freight/FreightDocuments';
import FreightPricing from '../freight/FreightPricing';
import FreightSettings from '../freight/FreightSettings';
import FreightClientPortal from '../freight/FreightClientPortal';
import UnifiedTrackingPage from '../freight/tracking/UnifiedTrackingPage';
import FreightRoutesPage from '../freight/FreightRoutesPage';
import FreightAccountingPage from '../freight/FreightAccountingPage';
import ContainerManagerPage from '../freight/containers/ContainerManagerPage';
import FreightInvoicesPage from '../freight/FreightInvoicesPage';

export const FreightRenderer: React.FC<{ submoduleId: string }> = ({ submoduleId }) => {
  switch (submoduleId) {
    case 'freight-dashboard':
      return <FreightDashboard />;
    case 'freight-shipments':
      return <FreightShipmentsPage />;
    case 'freight-accounting':
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
    case 'freight-containers':
      return <ContainerManagerPage />;
    case 'freight-invoices':
      return <FreightInvoicesPage />;
    default:
      return <div>Submodule {submoduleId} not found in FreightRenderer</div>;
  }
};

export default FreightRenderer;

// For backward compatibility, add this function that returns the component output
export const renderFreightSubmodule = (submoduleId: string, submodule: any) => {
  return <FreightRenderer submoduleId={submoduleId} />;
};
