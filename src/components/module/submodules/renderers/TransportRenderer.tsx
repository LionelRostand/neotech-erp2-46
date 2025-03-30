
import React from 'react';
import { SubModule } from '@/data/types/modules';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import TransportCustomerService from '../transport/TransportCustomerService';
import TransportDashboard from '../transport/TransportDashboard';
import TransportDrivers from '../transport/TransportDrivers';
import ChevronsUpDown from "@/components/icons/ChevronIcons";

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
    default:
      return <DefaultSubmoduleContent title={submodule.name} submodule={submodule} />;
  }
};

// Export for named imports
export default TransportRenderer;
