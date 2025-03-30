
import React from 'react';
import { SubModule } from '@/data/types/modules';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import TransportCustomerService from '../transport/TransportCustomerService';
import TransportDashboard from '../transport/TransportDashboard';
import TransportDrivers from '../transport/TransportDrivers';
import TransportSettings from '../transport/TransportSettings';
import TransportPlanning from '../transport/TransportPlanning';
import TransportReservations from '../transport/TransportReservations';
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
    case 'transport-payments':
      // Import TransportPayments dynamically to avoid errors
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
