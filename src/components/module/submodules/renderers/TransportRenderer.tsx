
import React from 'react';
import { SubModule } from '@/data/types/modules';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import TransportCustomerService from '../transport/TransportCustomerService';
import TransportDashboard from '../transport/TransportDashboard';
import TransportDrivers from '../transport/TransportDrivers';
import TransportSettings from '../transport/TransportSettings';
import TransportPlanning from '../transport/TransportPlanning';
import TransportReservations from '../transport/TransportReservations';
import TransportFleet from '../transport/TransportFleet';
import TransportLoyalty from '../transport/TransportLoyalty';
import TransportWebBooking from '../transport/TransportWebBooking';
import { ChevronsUpDown } from "lucide-react";

// Make ChevronsUpDown available globally
// TypeScript-safe approach using declaration merging
declare global {
  interface Window {
    ChevronsUpDown: typeof ChevronsUpDown;
  }
}

// Assign to window object immediately
if (typeof window !== 'undefined') {
  window.ChevronsUpDown = ChevronsUpDown;
}

interface TransportRendererProps {
  submoduleId: string;
  submodule: SubModule;
}

// Transport module renderer component
export const TransportRenderer: React.FC<TransportRendererProps> = ({ submoduleId, submodule }) => {
  // Make ChevronsUpDown available each time this component renders
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.ChevronsUpDown = ChevronsUpDown;
    }
  }, []);

  switch (submoduleId) {
    case 'transport-dashboard':
      return <TransportDashboard />;
    case 'transport-customer-service':
      return <TransportCustomerService />;
    case 'transport-drivers':
      return <TransportDrivers />;
    case 'transport-settings':
      return <TransportSettings />;
    case 'transport-planning':
      return <TransportPlanning />;
    case 'transport-reservations':
      return <TransportReservations />;
    case 'transport-fleet':
      return <TransportFleet />;
    case 'transport-loyalty':
      return <TransportLoyalty />;
    case 'transport-web-booking':
      return <TransportWebBooking />;
    case 'transport-geolocation':
      // For geolocation, we'll use a dynamic import since we don't have direct access to the file
      const TransportGeolocation = React.lazy(() => 
        import('../transport/TransportGeolocation')
      );
      return (
        <React.Suspense fallback={<div>Chargement de la géolocalisation...</div>}>
          <TransportGeolocation />
        </React.Suspense>
      );
    case 'transport-payments':
      // For payments, we'll use a dynamic import
      const TransportPayments = React.lazy(() => 
        import('../transport/TransportPayments')
      );
      return (
        <React.Suspense fallback={<div>Chargement des paiements...</div>}>
          <TransportPayments />
        </React.Suspense>
      );
    default:
      return <DefaultSubmoduleContent title={submodule.name} submodule={submodule} />;
  }
};

// Export for named imports
export default TransportRenderer;
